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

const PRODUCT_CATEGORY_MAP: Record<string, string> = {
  'cua-nhom': 'Cửa nhôm',
  'cua-upvc': 'Cửa uPVC',
  'cua-go': 'Cửa gỗ',
  'cua-cuon': 'Cửa cuốn',
  'cua-tu-dong': 'Cửa tự động',
  'san-pham-kinh': 'Sản phẩm kính',
  'cua-thong-minh': 'Cửa thông minh',
  'cua-di-nhom-eurowindow': 'Cửa nhôm',
  'cua-tu-dong-thong-minh': 'Cửa thông minh',
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const resolvedParams = await params;

  if (PRODUCT_CATEGORY_MAP[resolvedParams.id]) {
    const catName = PRODUCT_CATEGORY_MAP[resolvedParams.id];
    return {
      title: `${catName} Eurowindow - Bộ Sưu Tập Chính Hãng`,
      description: `Khám phá các dòng sản phẩm ${catName} tiêu chuẩn Châu Âu cao cấp từ Eurowindow.`,
      alternates: {
        canonical: `${BASE_URL}/san-pham/${resolvedParams.id}`,
      },
      openGraph: {
        title: `${catName} Eurowindow Chính Hãng`,
        description: `Khám phá các dòng sản phẩm ${catName} tiêu chuẩn Châu Âu cao cấp.`,
        url: `${BASE_URL}/san-pham/${resolvedParams.id}`,
      },
    };
  }

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
