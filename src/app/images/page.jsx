"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Images() {
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);

  const handleImageUpload = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/images', { url: imageUrl });

      console.log('Image uploaded:', response.data);
      setImages([...images, response.data]);
      setImageUrl('');
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('/api/images');
        setImages(response.data);
      } catch (error) {
        console.error('Error fetching images:', error.response?.data || error.message);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Image Upload</h1>
      <form onSubmit={handleImageUpload} className="space-y-4">
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL"
          className="p-2 border border-gray-300 rounded w-full"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Upload
        </button>
      </form>

      <h2 className="mt-8 text-2xl">Uploaded Images</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.url}
            alt={`Uploaded ${image.id}`}
            className="w-full h-auto border border-gray-300 rounded"
          />
        ))}
      </div>
    </div>
  );
}
