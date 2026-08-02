/**
 * JSON-LD Schema Generator
 * Generates valid structured data for all major schema types
 * Supports: Organization, LocalBusiness, Product, Article, FAQ, Breadcrumb, HowTo, Service, WebSite
 */

import type { SchemaType, SchemaGeneratorInput, SchemaGeneratorResult } from './types';

// ─── Base Eurowindow Organization ──────────────────────────────────────────────

const EUROWINDOW_ORG = {
  '@type': 'Organization',
  name: 'Eurowindow',
  url: 'https://eurowindow.com.vn',
  logo: 'https://eurowindow.com.vn/logo.png',
  sameAs: [
    'https://www.facebook.com/eurowindow.official',
    'https://www.youtube.com/@Eurowindow',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '1800-599-909',
    contactType: 'customer service',
    areaServed: 'VN',
    availableLanguage: 'Vietnamese',
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Lô B3, KCN Thăng Long, Đông Anh',
    addressLocality: 'Hà Nội',
    addressCountry: 'VN',
  },
};

// ─── Schema Builders ────────────────────────────────────────────────────────────

function buildOrganization(data: Record<string, unknown>) {
  return {
    '@context': 'https://schema.org',
    ...EUROWINDOW_ORG,
    ...data,
  };
}

function buildLocalBusiness(data: Record<string, unknown>) {
  const { '@type': _orgType, ...baseOrg } = EUROWINDOW_ORG;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    ...baseOrg,
    priceRange: data.priceRange ?? '$$',
    openingHoursSpecification: data.openingHours ?? [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '17:30',
    }],
    ...data,
  };
}

function buildProduct(data: Record<string, unknown>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name ?? '',
    description: data.description ?? '',
    brand: { '@type': 'Brand', name: 'Eurowindow' },
    manufacturer: EUROWINDOW_ORG,
    image: data.image ?? [],
    offers: data.offers ?? {
      '@type': 'Offer',
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Eurowindow' },
    },
    ...data,
  };
}

function buildArticle(data: Record<string, unknown>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title ?? data.headline ?? '',
    description: data.description ?? '',
    author: {
      '@type': 'Organization',
      name: 'Eurowindow',
      url: 'https://eurowindow.com.vn',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Eurowindow',
      logo: { '@type': 'ImageObject', url: 'https://eurowindow.com.vn/logo.png' },
    },
    datePublished: data.datePublished ?? new Date().toISOString(),
    dateModified: data.dateModified ?? new Date().toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': data.url ?? '' },
    ...data,
  };
}

function buildBreadcrumb(data: Record<string, unknown>) {
  const items = (data.items as Array<{ name: string; url: string }>) ?? [];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function buildFaq(data: Record<string, unknown>) {
  const faqs = (data.faqs as Array<{ question: string; answer: string }>) ?? [];
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

function buildHowTo(data: Record<string, unknown>) {
  const steps = (data.steps as Array<{ name: string; text: string }>) ?? [];
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: data.name ?? '',
    description: data.description ?? '',
    step: steps.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      text: step.text,
    })),
    ...data,
  };
}

function buildService(data: Record<string, unknown>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.name ?? '',
    description: data.description ?? '',
    provider: EUROWINDOW_ORG,
    areaServed: { '@type': 'Country', name: 'Vietnam' },
    serviceType: data.serviceType ?? '',
    ...data,
  };
}

function buildWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Eurowindow',
    url: 'https://eurowindow.com.vn',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://eurowindow.com.vn/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

function buildAggregateRating(data: Record<string, unknown>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.productName ?? 'Eurowindow Product',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data.ratingValue ?? '4.8',
      reviewCount: data.reviewCount ?? '100',
      bestRating: '5',
      worstRating: '1',
    },
    ...data,
  };
}

// ─── Simple Validation ─────────────────────────────────────────────────────────

function validateSchema(schema: Record<string, unknown>): string[] {
  const errors: string[] = [];
  if (!schema['@context']) errors.push('Missing @context');
  if (!schema['@type']) errors.push('Missing @type');

  if (schema['@type'] === 'FAQPage') {
    const entities = schema.mainEntity as unknown[];
    if (!entities || entities.length === 0) errors.push('FAQPage needs at least 1 question');
  }
  if (schema['@type'] === 'BreadcrumbList') {
    const items = schema.itemListElement as unknown[];
    if (!items || items.length === 0) errors.push('BreadcrumbList needs at least 1 item');
  }
  if (schema['@type'] === 'Product') {
    if (!schema.name) errors.push('Product requires name');
  }

  return errors;
}

// ─── Main Generator ────────────────────────────────────────────────────────────

export function generateSchema(input: SchemaGeneratorInput): SchemaGeneratorResult {
  const { type, data } = input;

  let schema: Record<string, unknown>;

  switch (type) {
    case 'Organization':       schema = buildOrganization(data); break;
    case 'LocalBusiness':      schema = buildLocalBusiness(data); break;
    case 'Product':            schema = buildProduct(data); break;
    case 'Article':            schema = buildArticle(data); break;
    case 'Breadcrumb':         schema = buildBreadcrumb(data); break;
    case 'FAQ':                schema = buildFaq(data); break;
    case 'HowTo':              schema = buildHowTo(data); break;
    case 'Service':            schema = buildService(data); break;
    case 'WebSite':            schema = buildWebSite(); break;
    case 'AggregateRating':    schema = buildAggregateRating(data); break;
    default:                   schema = { '@context': 'https://schema.org', '@type': type, ...data };
  }

  const validationErrors = validateSchema(schema);
  const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;

  return {
    schema,
    jsonLd,
    validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
    isValid: validationErrors.length === 0,
  };
}

export { EUROWINDOW_ORG };
