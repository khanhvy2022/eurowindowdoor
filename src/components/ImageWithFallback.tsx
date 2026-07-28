'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackSrc = '/images/eurowindow-banner-cua-nhom-kinh-trang-chu.png.webp',
  className,
  priority,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <Image
      {...props}
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt || 'Eurowindow'}
      className={className || ''}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => {
        setHasError(true);
      }}
    />
  );
};
