import React from 'react';

interface ThumbnailGalleryProps {
  images: { src: string; alt: string }[];
  selectedImage: string | null;
  onImageSelect: (url: string) => void;
}

export const ThumbnailGallery: React.FC<ThumbnailGalleryProps> = ({ images, selectedImage, onImageSelect }) => {
  return (
    <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-2">
      {images.map((image) => (
        <button
          key={image.src}
          onClick={() => onImageSelect(image.src)}
          className={`relative aspect-square rounded-md cursor-pointer transition-transform duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400 overflow-hidden ${
            selectedImage === image.src ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-cyan-400' : 'ring-1 ring-gray-600'
          }`}
          style={{
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%), 
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
            backgroundSize: '10px 10px',
            backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
            backgroundColor: '#fff'
          }}
          aria-label={`Select image of ${image.alt}`}
        >
          <img 
            src={image.src} 
            alt={image.alt}
            className="w-full h-full object-contain p-1"
          />
        </button>
      ))}
    </div>
  );
};