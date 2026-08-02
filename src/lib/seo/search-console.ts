/**
 * Google Search Console Search Analytics integration.
 *
 * The Search Analytics API is the sole source for the metrics returned here.
 * This module deliberately never synthesizes metrics when the property has not
 * been connected or when Google rejects a request.
 */

import { SignJWT, importPKCS8 } from 'jose';
import { format, subDays } from 'date-fns';
import type { SearchConsoleData, SearchConsoleMetrics } from './types';

const GSC_SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token';
const SEARCH_ANALYTICS_ENDPOINT = 'https://www.googleapis.com/webmasters/v3/sites';

type GscRow = { keys?: string[]; clicks?: number; impressions?: number; ctr?: number; position?: number };
type GscResponse = { rows?: GscRow[] };

function emptyData(siteUrl: string | undefined, status: SearchConsoleData['connectionStatus'], error?: string): SearchConsoleData {
  return {
    summary: { clicks: 0, impressions: 0, ctr: 0, position: 0, date: '' },
    byDate: [], topQueries: [], topPages: [], topCountries: [], topDevices: [],
    fetchedAt: new Date(),
    isLiveData: false,
    connectionStatus: status,
    siteUrl,
    error,
  };
}

function metricFromRow(row: GscRow, date = ''): SearchConsoleMetrics {
  return {
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
    date,
  };
}

function configuredSiteUrl(domain?: string): string {
  return process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL
    || `sc-domain:${(domain || 'eurowindowdoor.com').replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
}

async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const key = await importPKCS8(privateKey.replace(/\\n/g, '\n'), 'RS256');
  const assertion = await new SignJWT({ scope: GSC_SCOPE })
    .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
    .setIssuer(clientEmail)
    .setSubject(clientEmail)
    .setAudience(TOKEN_ENDPOINT)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(key);

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`Google OAuth returned ${response.status}`);
  const body = await response.json() as { access_token?: string };
  if (!body.access_token) throw new Error('Google OAuth did not return an access token');
  return body.access_token;
}

async function querySearchAnalytics(accessToken: string, siteUrl: string, body: Record<string, unknown>): Promise<GscResponse> {
  const response = await fetch(`${SEARCH_ANALYTICS_ENDPOINT}/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`Search Console API returned ${response.status}`);
  return response.json() as Promise<GscResponse>;
}

export async function getSearchConsoleData(domain?: string, requestedDays = 28): Promise<SearchConsoleData> {
  const clientEmail = process.env.GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY;
  const siteUrl = configuredSiteUrl(domain);
  if (!clientEmail || !privateKey) {
    return emptyData(siteUrl, 'not_configured', 'Chưa cấu hình service account Google Search Console.');
  }

  const days = Math.max(1, Math.min(90, Number.isFinite(requestedDays) ? Math.floor(requestedDays) : 28));
  // Search Console can revise recent data; yesterday is the latest complete day.
  const endDate = subDays(new Date(), 1);
  const startDate = subDays(endDate, days - 1);
  const dateRange = { startDate: format(startDate, 'yyyy-MM-dd'), endDate: format(endDate, 'yyyy-MM-dd'), rowLimit: 1000 };

  try {
    const accessToken = await getAccessToken(clientEmail, privateKey);
    const [summaryResult, byDateResult, queriesResult, pagesResult, countriesResult, devicesResult] = await Promise.all([
      querySearchAnalytics(accessToken, siteUrl, dateRange),
      querySearchAnalytics(accessToken, siteUrl, { ...dateRange, dimensions: ['date'] }),
      querySearchAnalytics(accessToken, siteUrl, { ...dateRange, dimensions: ['query'], rowLimit: 25 }),
      querySearchAnalytics(accessToken, siteUrl, { ...dateRange, dimensions: ['page'], rowLimit: 25 }),
      querySearchAnalytics(accessToken, siteUrl, { ...dateRange, dimensions: ['country'], rowLimit: 25 }),
      querySearchAnalytics(accessToken, siteUrl, { ...dateRange, dimensions: ['device'], rowLimit: 25 }),
    ]);

    const summaryRow = summaryResult.rows?.[0] ?? {};
    return {
      summary: metricFromRow(summaryRow, dateRange.endDate),
      byDate: (byDateResult.rows ?? []).map(row => metricFromRow(row, row.keys?.[0] ?? '')).sort((a, b) => a.date.localeCompare(b.date)),
      topQueries: (queriesResult.rows ?? []).map(row => ({ ...metricFromRow(row), query: row.keys?.[0] ?? '' })),
      topPages: (pagesResult.rows ?? []).map(row => ({ ...metricFromRow(row), page: row.keys?.[0] ?? '' })),
      topCountries: (countriesResult.rows ?? []).map(row => ({ ...metricFromRow(row), country: row.keys?.[0] ?? '' })),
      topDevices: (devicesResult.rows ?? []).map(row => ({ ...metricFromRow(row), device: row.keys?.[0] ?? '' })),
      fetchedAt: new Date(),
      isLiveData: true,
      connectionStatus: 'connected',
      siteUrl,
    };
  } catch (error) {
    console.error('[GSC] Unable to fetch Search Console data:', error);
    return emptyData(siteUrl, 'error', error instanceof Error ? error.message : 'Không thể truy xuất dữ liệu Search Console.');
  }
}
