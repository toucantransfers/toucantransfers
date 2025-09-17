import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface ImageViewerProps {
  imageUrl: string | null;
  backgroundColor: string;
}

const TSHIRT_IMAGE_URL = 'https://www.toucantransfers.com/cdn/shop/files/tshirt_26379bdd-6464-4ada-83c3-19611be37105.png?v=1758140071&width=1160';

// --- Helper Functions for Color Conversion ---
const hexToRgb = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
};


const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-gray-400">
        <svg className="animate-spin h-10 w-10 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p>Loading T-shirt...</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-red-400 text-center">
        <p>Error loading mockup:</p>
        <p className="text-sm">{message}</p>
    </div>
);


export const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, backgroundColor }) => {
    const [coloredTshirtUrl, setColoredTshirtUrl] = useState<string | null>(null);
    const [originalTshirtImage, setOriginalTshirtImage] = useState<HTMLImageElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the base T-shirt image once
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            setOriginalTshirtImage(img);
            setIsLoading(false);
        };
        img.onerror = () => {
            setError('Failed to fetch the T-shirt image. Please check the URL.');
            setIsLoading(false);
        };
        img.src = TSHIRT_IMAGE_URL;
    }, []);

    // Process the image whenever the color or base image changes
    useEffect(() => {
        if (!originalTshirtImage) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = originalTshirtImage.width;
        canvas.height = originalTshirtImage.height;
        ctx.drawImage(originalTshirtImage, 0, 0);

        const targetRgb = hexToRgb(backgroundColor);
        if (!targetRgb) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            
            if (a === 0) continue; // Skip transparent pixels

            const [h, s] = rgbToHsl(r, g, b);

            // Target pink/magenta hues (approx. 300-350 degrees) with reasonable saturation
            if (s > 0.15 && (h > 300 || h < 20)) {
                // Replace the pixel with the solid target color, removing shadows.
                data[i] = targetRgb[0];
                data[i + 1] = targetRgb[1];
                data[i + 2] = targetRgb[2];
            }
        }

        ctx.putImageData(imageData, 0, 0);
        setColoredTshirtUrl(canvas.toDataURL());

    }, [backgroundColor, originalTshirtImage]);


    const renderContent = () => {
        if (isLoading) {
            return <LoadingSpinner />;
        }
        if (error) {
            return <ErrorDisplay message={error} />;
        }
        if (coloredTshirtUrl) {
            return (
                <div 
                    className="relative w-full max-w-3xl aspect-[1/1]"
                    role="img"
                    aria-label={`T-shirt mockup with user design, colored ${backgroundColor}`}
                >
                    <img
                        src={coloredTshirtUrl}
                        alt="T-shirt mockup"
                        className="absolute inset-0 w-full h-full object-contain"
                    />

                    {/* User Design */}
                    {imageUrl && (
                        <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%]">
                            <img
                                src={imageUrl}
                                alt="Your design"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    )}
                </div>
            )
        }
        return null;
    }

  return (
    <div 
      className="w-full h-[60vh] lg:h-full flex items-center justify-center rounded-lg shadow-inner p-4 bg-gray-800"
      aria-live="polite"
    >
        {renderContent()}
    </div>
  );
};