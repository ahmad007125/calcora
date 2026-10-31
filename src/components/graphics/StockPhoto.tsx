import React from 'react';

interface StockPhotoProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  overlay?: boolean;
}

export const StockPhoto: React.FC<StockPhotoProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  overlay = false,
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${imgClassName}`}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
      )}
    </div>
  );
};
