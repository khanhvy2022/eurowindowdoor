/**
 * Product JSON-LD Structured Data Generator
 * Single source of truth for all Product schema on eurowindowdoor.com
 *
 * Based on real business data:
 * - Warranty policy from /chinh-sach page
 * - Nationwide delivery policy from /chinh-sach page
 * - No reviews/ratings (no system exists)
 * - No fixed prices (quote-on-request model)
 */

import type { Product } from '@/data/products';

const BASE_URL = 'https://eurowindowdoor.com';

// ─── Shared MerchantReturnPolicy ────────────────────────────────────────────────
// Source: /chinh-sach page — "Chính sách bảo hành sản phẩm"
// Eurowindow manufactures custom doors/windows to specification.
// Custom-manufactured goods are non-returnable.
// Warranty: up to 10 years for profiles, 5 years for hardware.

const EUROWINDOW_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy' as const,
  applicableCountry: 'VN',
  returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
  merchantReturnLink: `${BASE_URL}/chinh-sach`,
};

// ─── Shared OfferShippingDetails ────────────────────────────────────────────────
// Source: /chinh-sach page — "Quy trình thanh toán & Giao hàng"
// "Hỗ trợ vận chuyển tận nơi công trình trên toàn quốc"
// Custom manufacturing takes 7–30 days, transit 1–5 days nationwide.

const EUROWINDOW_SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails' as const,
  shippingDestination: {
    '@type': 'DefinedRegion' as const,
    addressCountry: 'VN',
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime' as const,
    handlingTime: {
      '@type': 'QuantitativeValue' as const,
      minValue: 7,
      maxValue: 30,
      unitCode: 'DAY',
    },
    transitTime: {
      '@type': 'QuantitativeValue' as const,
      minValue: 1,
      maxValue: 5,
      unitCode: 'DAY',
    },
  },
};

// ─── Seller ─────────────────────────────────────────────────────────────────────

const EUROWINDOW_SELLER = {
  '@type': 'Organization' as const,
  name: 'Eurowindow',
  url: BASE_URL,
};

// ─── Product JSON-LD Generator ──────────────────────────────────────────────────

export interface ProductJsonLdInput {
  product: Product;
  /** Absolute URL for this product page */
  url: string;
}

/**
 * Generates a valid Product JSON-LD object from real product data.
 *
 * Rules:
 * - Only includes fields with real data
 * - No fake prices (quote-on-request model)
 * - No fake reviews/ratings (no review system)
 * - shippingDetails and hasMerchantReturnPolicy from real policy pages
 */
export function generateProductJsonLd({ product, url }: ProductJsonLdInput): Record<string, unknown> {
  // Build image array — use absolute URLs
  const images: string[] = [];
  if (product.image) {
    images.push(`${BASE_URL}${product.image}`);
  }
  if (product.gallery) {
    for (const img of product.gallery) {
      const absUrl = `${BASE_URL}${img}`;
      if (!images.includes(absUrl)) {
        images.push(absUrl);
      }
    }
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images,
    brand: {
      '@type': 'Brand',
      name: 'Eurowindow',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Eurowindow',
      url: BASE_URL,
    },
    category: product.category,
    url,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'VND',
      price: '0',
      availability: 'https://schema.org/PreOrder',
      itemCondition: 'https://schema.org/NewCondition',
      url,
      seller: EUROWINDOW_SELLER,
      shippingDetails: EUROWINDOW_SHIPPING_DETAILS,
      hasMerchantReturnPolicy: EUROWINDOW_RETURN_POLICY,
    },
  };

  return schema;
}

// ─── Breadcrumb JSON-LD for Product Pages ───────────────────────────────────────

export function generateProductBreadcrumbJsonLd(product: Product): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Sản phẩm',
        item: `${BASE_URL}/san-pham`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${BASE_URL}/san-pham/${product.slug}`,
      },
    ],
  };
}

export { EUROWINDOW_RETURN_POLICY, EUROWINDOW_SHIPPING_DETAILS, EUROWINDOW_SELLER, BASE_URL };
