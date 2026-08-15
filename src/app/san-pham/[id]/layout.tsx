import { Metadata } from 'next';
import { productsData } from '@/data/products';
import {
  generateProductJsonLd,
  generateProductBreadcrumbJsonLd,
  BASE_URL,
} from '@/lib/seo/product-schema';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = productsData.find(
    (p) => p.slug === resolvedParams.id || p.id === resolvedParams.id
  );

  if (!product) {
    return {
      title: 'Sản phẩm không tồn tại',
    };
  }

  return {
    title: `${product.name} - ${product.category}`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Eurowindow`,
      description: product.description,
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      url: `${BASE_URL}/san-pham/${product.slug}`,
    },
    alternates: {
      canonical: `${BASE_URL}/san-pham/${product.slug}`,
    },
  };
}

export default async function ProductDetailLayout({ children, params }: LayoutProps) {
  const resolvedParams = await params;
  const product = productsData.find(
    (p) => p.slug === resolvedParams.id || p.id === resolvedParams.id
  );

  if (!product) {
    return <>{children}</>;
  }

  const productUrl = `${BASE_URL}/san-pham/${product.slug}`;
  const productSchema = generateProductJsonLd({ product, url: productUrl });
  const breadcrumbSchema = generateProductBreadcrumbJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
