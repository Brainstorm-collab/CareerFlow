import { useEffect, useState } from 'react';

const useImagePreloader = (imageUrls) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) return;

    let loadedCount = 0;
    const totalImages = imageUrls.length;

    const preloadImage = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setLoadedImages(prev => new Set([...prev, url]));
          setLoadingProgress((loadedCount / totalImages) * 100);
          resolve(url);
        };
        img.onerror = () => {
          loadedCount++;
          setLoadingProgress((loadedCount / totalImages) * 100);
          reject(new Error(`Failed to load image: ${url}`));
        };
        img.src = url;
      });
    };

    // Preload images in batches to avoid overwhelming the browser
    const batchSize = 5;
    const batches = [];
    for (let i = 0; i < imageUrls.length; i += batchSize) {
      batches.push(imageUrls.slice(i, i + batchSize));
    }

    const preloadBatches = async () => {
      for (const batch of batches) {
        await Promise.allSettled(batch.map(preloadImage));
        // Small delay between batches to prevent blocking
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    };

    preloadBatches();
  }, [imageUrls]);

  return { loadedImages, loadingProgress };
};

export default useImagePreloader;
