import React, { useState, memo } from 'react';
import './ProductImage.css';

export const ProductImage = memo(({ 
  imageUrl, 
  alt = "Product Image", 
  height = "10rem", 
  className = "",
  fallbackSrc = "/placeholder.png" 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const baseUrl = import.meta.env.VITE_STATIC_IMAGES_URL;
  
  const fullImageUrl = !imageUrl 
    ? fallbackSrc 
    : imageUrl.startsWith('http') 
      ? imageUrl 
      : `${baseUrl}/${imageUrl}`;

  return (
    <div 
      className={`image-wrapper ${!isLoaded ? 'shimmer' : ''}`}
      style={{ height }}
    >
      <img
        src={fullImageUrl}
        alt={alt}
        className={`product-img ${className} ${isLoaded ? 'loaded' : ''}`}
        onLoad={() => setIsLoaded(true)}
        // onError={(e) => { 
        //   e.target.onerror = null;
        //   e.target.src = fallbackSrc; 
        // }}
        loading="lazy"
      />
    </div>
  );
});

ProductImage.displayName = 'ProductImage';

export default ProductImage;