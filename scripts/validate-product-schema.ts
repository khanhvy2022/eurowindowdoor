/**
 * Product JSON-LD Validation Script
 * Validates all product structured data for Google Search Console compliance.
 * Run: node --experimental-strip-types scripts/validate-product-schema.ts
 */

import { productsData } from '../src/data/products';
import { generateProductJsonLd, generateProductBreadcrumbJsonLd, BASE_URL } from '../src/lib/seo/product-schema';

// ─── Validation rules ───────────────────────────────────────────────────────────

interface ValidationError {
  product: string;
  slug: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

const errors: ValidationError[] = [];
const warnings: ValidationError[] = [];

function addError(product: string, slug: string, field: string, message: string) {
  errors.push({ product, slug, field, message, severity: 'error' });
}

function addWarning(product: string, slug: string, field: string, message: string) {
  warnings.push({ product, slug, field, message, severity: 'warning' });
}

// ─── Run Validation ─────────────────────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════════════════');
console.log('  Product Structured Data Validation Report');
console.log(`  Date: ${new Date().toISOString()}`);
console.log(`  Total Products: ${productsData.length}`);
console.log('═══════════════════════════════════════════════════════════════\n');

const allSchemas: Record<string, unknown>[] = [];

for (const product of productsData) {
  const url = `${BASE_URL}/san-pham/${product.slug}`;
  const schema = generateProductJsonLd({ product, url });
  allSchemas.push(schema);

  // Required fields
  if (!schema['@context']) addError(product.name, product.slug, '@context', 'Missing @context');
  if (!schema['@type']) addError(product.name, product.slug, '@type', 'Missing @type');
  if (schema['@type'] !== 'Product') addError(product.name, product.slug, '@type', `Expected "Product", got "${schema['@type']}"`);
  if (!schema['name']) addError(product.name, product.slug, 'name', 'Missing name');
  if (!schema['description']) addError(product.name, product.slug, 'description', 'Missing description');
  if (!schema['image']) addError(product.name, product.slug, 'image', 'Missing image');
  if (!schema['brand']) addError(product.name, product.slug, 'brand', 'Missing brand');

  // Image array validation
  const images = schema['image'] as string[];
  if (Array.isArray(images)) {
    if (images.length === 0) addError(product.name, product.slug, 'image', 'Image array is empty');
    for (const img of images) {
      if (!img.startsWith('https://')) addError(product.name, product.slug, 'image', `Image must use absolute URL: ${img}`);
    }
  }

  // Brand validation
  const brand = schema['brand'] as Record<string, unknown>;
  if (brand) {
    if (brand['@type'] !== 'Brand') addError(product.name, product.slug, 'brand.@type', 'Brand must have @type: Brand');
    if (!brand['name']) addError(product.name, product.slug, 'brand.name', 'Brand must have name');
  }

  // Offers validation
  const offers = schema['offers'] as Record<string, unknown>;
  if (!offers) {
    addError(product.name, product.slug, 'offers', 'Missing offers');
  } else {
    if (offers['@type'] !== 'Offer') addError(product.name, product.slug, 'offers.@type', 'Offer must have @type: Offer');
    if (!offers['priceCurrency']) addWarning(product.name, product.slug, 'offers.priceCurrency', 'Missing priceCurrency');
    if (!offers['availability']) addError(product.name, product.slug, 'offers.availability', 'Missing availability');
    if (!offers['itemCondition']) addWarning(product.name, product.slug, 'offers.itemCondition', 'Missing itemCondition');
    if (!offers['url']) addWarning(product.name, product.slug, 'offers.url', 'Missing url');

    // shippingDetails validation (GSC fix)
    const shipping = offers['shippingDetails'] as Record<string, unknown>;
    if (!shipping) {
      addError(product.name, product.slug, 'offers.shippingDetails', 'Missing shippingDetails (GSC warning)');
    } else {
      if (shipping['@type'] !== 'OfferShippingDetails') addError(product.name, product.slug, 'shippingDetails.@type', 'Must be OfferShippingDetails');
      const dest = shipping['shippingDestination'] as Record<string, unknown>;
      if (!dest || !dest['addressCountry']) addError(product.name, product.slug, 'shippingDetails.destination', 'Missing shippingDestination');
      const deliveryTime = shipping['deliveryTime'] as Record<string, unknown>;
      if (!deliveryTime) addWarning(product.name, product.slug, 'shippingDetails.deliveryTime', 'Missing deliveryTime');
    }

    // hasMerchantReturnPolicy validation (GSC fix)
    const returnPolicy = offers['hasMerchantReturnPolicy'] as Record<string, unknown>;
    if (!returnPolicy) {
      addError(product.name, product.slug, 'offers.hasMerchantReturnPolicy', 'Missing hasMerchantReturnPolicy (GSC warning)');
    } else {
      if (returnPolicy['@type'] !== 'MerchantReturnPolicy') addError(product.name, product.slug, 'returnPolicy.@type', 'Must be MerchantReturnPolicy');
      if (!returnPolicy['applicableCountry']) addError(product.name, product.slug, 'returnPolicy.applicableCountry', 'Missing applicableCountry');
      if (!returnPolicy['returnPolicyCategory']) addError(product.name, product.slug, 'returnPolicy.returnPolicyCategory', 'Missing returnPolicyCategory');
    }

    // Fake data checks
    if (offers['price'] === '0' || offers['price'] === 0) {
      // Price 0 is acceptable for quote-on-request when no real price exists
      // But let's note it
      addWarning(product.name, product.slug, 'offers.price', 'Price is 0 (quote-on-request model). Google may show "Free" in results.');
    }
  }

  // No fake review/rating check
  if (schema['aggregateRating']) {
    addError(product.name, product.slug, 'aggregateRating', 'FAKE DATA: aggregateRating found but no review system exists');
  }
  if (schema['review']) {
    addError(product.name, product.slug, 'review', 'FAKE DATA: review found but no review system exists');
  }

  // URL validation
  if (schema['url'] && !(schema['url'] as string).startsWith('https://')) {
    addError(product.name, product.slug, 'url', 'URL must be absolute HTTPS');
  }

  // Breadcrumb validation
  const breadcrumb = generateProductBreadcrumbJsonLd(product);
  if (breadcrumb['@type'] !== 'BreadcrumbList') addError(product.name, product.slug, 'breadcrumb.@type', 'Must be BreadcrumbList');
  const items = breadcrumb['itemListElement'] as Array<Record<string, unknown>>;
  if (!items || items.length < 3) addError(product.name, product.slug, 'breadcrumb.items', 'Breadcrumb needs at least 3 items');

  // JSON parse check
  try {
    JSON.parse(JSON.stringify(schema));
  } catch {
    addError(product.name, product.slug, 'json', 'Invalid JSON structure');
  }
}

// ─── Duplicate check ────────────────────────────────────────────────────────────

const slugSet = new Set<string>();
for (const product of productsData) {
  if (slugSet.has(product.slug)) {
    addError(product.name, product.slug, 'slug', `Duplicate product slug: ${product.slug}`);
  }
  slugSet.add(product.slug);
}

// ─── Output Results ─────────────────────────────────────────────────────────────

console.log('─── ERRORS ─────────────────────────────────────────────────────');
if (errors.length === 0) {
  console.log('✅ No errors found!');
} else {
  for (const err of errors) {
    console.log(`❌ [${err.slug}] ${err.field}: ${err.message}`);
  }
}

console.log('\n─── WARNINGS ───────────────────────────────────────────────────');
if (warnings.length === 0) {
  console.log('✅ No warnings found!');
} else {
  for (const warn of warnings) {
    console.log(`⚠️  [${warn.slug}] ${warn.field}: ${warn.message}`);
  }
}

console.log('\n─── SUMMARY ────────────────────────────────────────────────────');
console.log(`Products validated: ${productsData.length}`);
console.log(`Errors: ${errors.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`JSON-LD valid: ${errors.length === 0 ? '✅ YES' : '❌ NO'}`);

console.log('\n─── GSC FIX STATUS ─────────────────────────────────────────────');
const hasShipping = allSchemas.every(s => {
  const offers = s['offers'] as Record<string, unknown>;
  return offers?.['shippingDetails'];
});
const hasReturn = allSchemas.every(s => {
  const offers = s['offers'] as Record<string, unknown>;
  return offers?.['hasMerchantReturnPolicy'];
});
const noFakeRating = allSchemas.every(s => !s['aggregateRating']);
const noFakeReview = allSchemas.every(s => !s['review']);

console.log(`shippingDetails present on all: ${hasShipping ? '✅' : '❌'}`);
console.log(`hasMerchantReturnPolicy present on all: ${hasReturn ? '✅' : '❌'}`);
console.log(`No fake aggregateRating: ${noFakeRating ? '✅' : '❌'}`);
console.log(`No fake review: ${noFakeReview ? '✅' : '❌'}`);

console.log('\n─── PRODUCT URLS ───────────────────────────────────────────────');
for (const product of productsData) {
  console.log(`  ${BASE_URL}/san-pham/${product.slug}`);
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log(errors.length === 0 ? '✅ ALL VALIDATIONS PASSED' : '❌ VALIDATION FAILED');
console.log('═══════════════════════════════════════════════════════════════');

process.exit(errors.length > 0 ? 1 : 0);
