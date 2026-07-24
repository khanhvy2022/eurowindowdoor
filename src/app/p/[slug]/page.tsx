import { notFound, redirect } from 'next/navigation';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BloggerStaticPage({ params }: Props) {
  const { slug } = await params;
  const cleanSlug = slug.replace(/\.html$/, '');

  if (cleanSlug.includes('gioi-thieu') || cleanSlug.includes('about')) {
    redirect('/gioi-thieu');
  } else if (cleanSlug.includes('lien-he') || cleanSlug.includes('contact')) {
    redirect('/lien-he');
  } else if (cleanSlug.includes('san-pham') || cleanSlug.includes('product')) {
    redirect('/san-pham');
  }

  redirect('/tin-tuc');
}
