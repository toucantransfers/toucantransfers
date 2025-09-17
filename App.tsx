import React, { useState, useEffect } from 'react';
import { ImageViewer } from './components/ImageViewer';
import { ColorPalette } from './components/ColorPalette';
import { ThumbnailGallery } from './components/ThumbnailGallery';
import { COLOR_OPTIONS, PRESET_IMAGES } from './constants';

const Header: React.FC = () => (
  <header className="py-4 px-8 text-center bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
    <h1 className="text-3xl font-bold text-white tracking-wider">
      <span className="text-cyan-400">Toucan</span> Transfers
    </h1>
    <p className="text-gray-400 mt-1">Preview Your Designs on Custom T-Shirts</p>
  </header>
);

const LoadingSpinner: React.FC = () => (
  <>
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Fetching...
  </>
);


const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>(COLOR_OPTIONS[1]); // Default to light gray
  const [libraryImages, setLibraryImages] = useState(PRESET_IMAGES);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchingSource, setFetchingSource] = useState<string | null>(null);


  const handleFetchImages = async (fetchUrl: string, source: string) => {
    setIsFetching(true);
    setFetchingSource(source);
    setFetchError(null);
    try {
      
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error('Could not fetch product data. Please try again later.');
      }
      const productData = await response.json();

      if (!productData || !productData.images || productData.images.length === 0) {
         throw new Error('No images found for this product.');
      }

      const newImages = productData.images.map((imgSrc: string, index: number) => ({
          src: imgSrc.replace(/(\.[^.]+)$/, '_1024x1024$1'), // Get a larger image variant
          alt: `${productData.title} - Image ${index + 1}`,
      }));

      setLibraryImages(newImages);
      setImage(newImages[0]?.src || null);

    } catch (error) {
      console.error(error);
      setFetchError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsFetching(false);
      setFetchingSource(null);
    }
  };

  useEffect(() => {
    // Fetch Girls images by default on initial load
    handleFetchImages('https://www.toucantransfers.com/products/app.js', 'GIRLS');
  }, []);


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        <div className="flex-grow lg:w-2/3">
          <ImageViewer imageUrl={image} backgroundColor={backgroundColor} />
        </div>
        <aside className="lg:w-1/3 flex flex-col gap-8">
           <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Load Latest Designs</h2>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-3">
                 <button
                    onClick={() => handleFetchImages('https://www.toucantransfers.com/products/app.js', 'GIRLS')}
                    disabled={isFetching}
                    className="w-full text-center bg-pink-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors duration-300 flex items-center justify-center"
                  >
                    {isFetching && fetchingSource === 'GIRLS' ? <LoadingSpinner /> : 'GIRLS'}
                  </button>
                  <button
                    onClick={() => handleFetchImages('https://www.toucantransfers.com/products/app2.js', 'KIDS')}
                    disabled={isFetching}
                    className="w-full text-center bg-cyan-600 hover:bg-pink-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors duration-300 flex items-center justify-center"
                  >
                    {isFetching && fetchingSource === 'KIDS' ? <LoadingSpinner /> : 'KIDS'}
                  </button>
              </div>
              {fetchError && <p className="text-red-400 text-sm mt-2">{fetchError}</p>}
            </div>
           </div>
           <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Image Library</h2>
            <ThumbnailGallery 
                images={libraryImages}
                selectedImage={image}
                onImageSelect={setImage}
            />
          </div>
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">T-Shirt Color</h2>
            <ColorPalette 
              selectedColor={backgroundColor} 
              onColorChange={setBackgroundColor} 
            />
          </div>
        </aside>
      </main>
    </div>
  );
};

export default App;