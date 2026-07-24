export interface SlideItem {
  id: number;
  title: string;
  image: string;
  mobileImage?: string;
  link: string;
  alt: string;
}

export interface ProductCategory {
  id: string;
  title: string;
  image: string;
  link: string;
  subcategories?: { title: string; link: string }[];
}

export interface ProductItem {
  id: string;
  title: string;
  icon: string;
  link: string;
}

export interface NewsItem {
  id: string;
  title: string;
  image: string;
  link: string;
  category?: string;
  date?: string;
  summary?: string;
}

export interface NavMenuItem {
  title: string;
  link: string;
  children?: {
    title: string;
    link: string;
    children?: { title: string; link: string }[];
  }[];
}
