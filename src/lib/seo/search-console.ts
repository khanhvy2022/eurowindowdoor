/**
 * Google Search Console Integration
 * Phase 1: Mock data with real structure (ready for OAuth2 real data in Phase 2)
 * Phase 2: Replace mock with real GSC API calls using GOOGLE_SEARCH_CONSOLE_*
 */

import type { SearchConsoleData, SearchConsoleMetrics } from './types';
import { format, subDays } from 'date-fns';

function generateMockTrend(base: number, days: number, variance = 0.2): SearchConsoleMetrics[] {
  return Array.from({ length: days }, (_, i) => {
    const factor = 1 + (Math.random() - 0.5) * variance;
    return {
      clicks: Math.round(base * factor),
      impressions: Math.round(base * 10 * factor),
      ctr: parseFloat((base * factor / (base * 10 * factor)).toFixed(3)),
      position: parseFloat((15 + Math.random() * 10).toFixed(1)),
      date: format(subDays(new Date(), days - i), 'yyyy-MM-dd'),
    };
  });
}

export async function getSearchConsoleData(
  _domain?: string,
  days = 28,
): Promise<SearchConsoleData> {
  // Phase 1: structured mock data
  // TODO Phase 2: replace with real GSC API OAuth2 call
  const isLiveData = false;

  const byDate = generateMockTrend(120, days);
  const totalClicks    = byDate.reduce((s, d) => s + d.clicks, 0);
  const totalImpressions = byDate.reduce((s, d) => s + d.impressions, 0);
  const avgCtr         = parseFloat((totalClicks / totalImpressions).toFixed(3));
  const avgPosition    = parseFloat((byDate.reduce((s, d) => s + d.position, 0) / days).toFixed(1));

  return {
    summary: { clicks: totalClicks, impressions: totalImpressions, ctr: avgCtr, position: avgPosition, date: '' },
    byDate,
    topQueries: [
      { query: 'cửa nhôm eurowindow', clicks: 850, impressions: 12000, ctr: 0.071, position: 3.2, date: '' },
      { query: 'cửa nhựa upvc', clicks: 620, impressions: 9500, ctr: 0.065, position: 5.1, date: '' },
      { query: 'eurowindow cửa gỗ', clicks: 440, impressions: 7200, ctr: 0.061, position: 4.8, date: '' },
      { query: 'giá cửa nhôm', clicks: 380, impressions: 8900, ctr: 0.043, position: 7.3, date: '' },
      { query: 'cửa sổ nhôm kính', clicks: 290, impressions: 6100, ctr: 0.048, position: 6.5, date: '' },
      { query: 'kính low e eurowindow', clicks: 210, impressions: 4200, ctr: 0.050, position: 8.2, date: '' },
      { query: 'cửa nhôm ea55', clicks: 180, impressions: 3800, ctr: 0.047, position: 9.1, date: '' },
      { query: 'showroom eurowindow hà nội', clicks: 150, impressions: 2900, ctr: 0.052, position: 2.3, date: '' },
      { query: 'báo giá cửa nhôm', clicks: 130, impressions: 5600, ctr: 0.023, position: 11.4, date: '' },
      { query: 'cửa chống cháy eurowindow', clicks: 110, impressions: 3100, ctr: 0.035, position: 7.8, date: '' },
    ],
    topPages: [
      { page: '/san-pham/cua-nhom', clicks: 1200, impressions: 18000, ctr: 0.067, position: 4.1, date: '' },
      { page: '/san-pham/cua-nhua-upvc', clicks: 980, impressions: 15000, ctr: 0.065, position: 5.3, date: '' },
      { page: '/', clicks: 760, impressions: 22000, ctr: 0.035, position: 8.2, date: '' },
      { page: '/tin-tuc', clicks: 540, impressions: 9000, ctr: 0.060, position: 6.7, date: '' },
      { page: '/san-pham/cua-go', clicks: 420, impressions: 7500, ctr: 0.056, position: 7.4, date: '' },
    ],
    topCountries: [
      { country: 'Vietnam', clicks: totalClicks * 0.93, impressions: totalImpressions * 0.92, ctr: avgCtr, position: avgPosition, date: '' },
      { country: 'United States', clicks: totalClicks * 0.03, impressions: totalImpressions * 0.04, ctr: 0.025, position: 18.5, date: '' },
      { country: 'Singapore', clicks: totalClicks * 0.02, impressions: totalImpressions * 0.02, ctr: 0.030, position: 15.2, date: '' },
    ],
    topDevices: [
      { device: 'MOBILE', clicks: totalClicks * 0.65, impressions: totalImpressions * 0.68, ctr: avgCtr * 0.95, position: avgPosition + 1, date: '' },
      { device: 'DESKTOP', clicks: totalClicks * 0.30, impressions: totalImpressions * 0.27, ctr: avgCtr * 1.1, position: avgPosition - 0.5, date: '' },
      { device: 'TABLET', clicks: totalClicks * 0.05, impressions: totalImpressions * 0.05, ctr: avgCtr * 0.9, position: avgPosition + 0.5, date: '' },
    ],
    indexCoverage: { indexed: 342, notIndexed: 18, errors: 5, warnings: 12 },
    fetchedAt: new Date(),
    isLiveData,
  };
}
