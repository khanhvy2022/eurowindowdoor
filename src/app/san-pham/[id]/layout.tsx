import { Metadata } from 'next';
import { productsData } from '@/data/products';

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
      title: 'Sản phẩm không tồn tại | Eurowindow',
    };
  }

  return {
    title: `${product.name} - ${product.category} | Eurowindow`,
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
      url: `https://eurowindow.biz/san-pham/${product.slug}`,
    },
    alternates: {
      canonical: `https://eurowindow.biz/san-pham/${product.slug}`,
    },
  };
}

export default function ProductDetailLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
