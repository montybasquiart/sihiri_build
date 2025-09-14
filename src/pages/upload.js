import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../components/Layout';
import { useConnect } from '@stacks/connect-react';
import { UserSession } from '@stacks/connect';

export default function Upload() {
  const { doContractCall } = useConnect();
  const userSession = new UserSession();
  const [authenticated, setAuthenticated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'artwork',
    tags: '',
    license: 'cc-by',
    price: '',
    royaltyPercentage: '10'
  });

  // Check if user is authenticated
  React.useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setAuthenticated(true);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      // Preview the file
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFile({
          id: uuidv4(),
          name: file.name,
          type: file.type,
          size: file.size,
          preview: reader.result,
          file: file
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'audio/*': [],
      'video/*': [],
      'application/pdf': []
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024 // 100MB max size
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authenticated) {
      alert('Please sign in to upload content');
      return;
    }

    if (!uploadedFile) {
      alert('Please upload a file');
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 5;
        });
      }, 300);

      // In a real implementation, this would upload to IPFS or Arweave
      // and then call a smart contract to mint the NFT
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        
        // Simulate contract call for minting
        setTimeout(() => {
          setIsUploading(false);
          alert('Your creative work has been uploaded and minted successfully!');
          // Reset form
          setFormData({
            title: '',
            description: '',
            type: 'artwork',
            tags: '',
            license: 'cc-by',
            price: '',
            royaltyPercentage: '10'
          });
          setUploadedFile(null);
          setUploadProgress(0);
        }, 1000);
      }, 3000);

    } catch (error) {
      console.error('Upload error:', error);
      setIsUploading(false);
      alert('Error uploading your work. Please try again.');
    }
  };

  if (!authenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in with your Stacks wallet to upload content.</p>
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded"
              onClick={() => userSession.redirectToSignIn()}
            >
              Sign In with Stacks
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Upload Creative Work</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition duration-300 ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
              >
                <input {...getInputProps()} />
                
                {uploadedFile ? (
                  <div className="flex flex-col items-center">
                    {uploadedFile.type.startsWith('image/') ? (
                      <img 
                        src={uploadedFile.preview} 
                        alt="Preview" 
                        className="max-h-64 max-w-full mb-4 rounded"
                      />
                    ) : uploadedFile.type.startsWith('video/') ? (
                      <video 
                        src={uploadedFile.preview} 
                        className="max-h-64 max-w-full mb-4 rounded" 
                        controls
                      />
                    ) : uploadedFile.type.startsWith('audio/') ? (
                      <div className="w-full max-w-md mb-4">
                        <div className="bg-gray-100 p-4 rounded flex items-center justify-center">
                          <span className="text-4xl">🎵</span>
                        </div>
                        <audio 
                          src={uploadedFile.preview} 
                          className="w-full mt-2" 
                          controls 
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-100 p-8 rounded mb-4 flex items-center justify-center">
                        <span className="text-4xl">📄</span>
                      </div>
                    )}
                    
                    <div className="text-gray-800">
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">{(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                      }}
                      className="mt-4 text-sm text-red-600 hover:text-red-800"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-indigo-600 mb-2">
                      <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-8m-12 4h12a4 4 0 004-4v-4m-4-4l-4-4m0 0l-4 4m4-4v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-gray-800 font-medium">Drag and drop your file here, or click to select</p>
                    <p className="text-sm text-gray-500 mt-1">Supports images, audio, video, and PDF files (max 100MB)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="artwork">Artwork</option>
                  <option value="music">Music</option>
                  <option value="video">Video</option>
                  <option value="article">Article/Writing</option>
                  <option value="photography">Photography</option>
                  <option value="3d">3D Model</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="art, digital, abstract"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">License</label>
                <select
                  id="license"
                  name="license"
                  value={formData.license}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="cc-by">Creative Commons Attribution</option>
                  <option value="cc-by-sa">CC Attribution-ShareAlike</option>
                  <option value="cc-by-nc">CC Attribution-NonCommercial</option>
                  <option value="cc-by-nc-sa">CC Attribution-NonCommercial-ShareAlike</option>
                  <option value="cc0">CC0 (Public Domain)</option>
                  <option value="all-rights">All Rights Reserved</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (STX)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to upload without listing for sale</p>
              </div>
              
              <div>
                <label htmlFor="royaltyPercentage" className="block text-sm font-medium text-gray-700 mb-1">Royalty Percentage</label>
                <input
                  type="number"
                  id="royaltyPercentage"
                  name="royaltyPercentage"
                  value={formData.royaltyPercentage}
                  onChange={handleInputChange}
                  min="0"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">Percentage you'll receive from secondary sales (0-50%)</p>
              </div>
            </div>

            {isUploading ? (
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {uploadProgress < 100 ? 
                    `Uploading... ${uploadProgress}%` : 
                    'Processing... Minting your NFT'}
                </p>
              </div>
            ) : (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded"
                >
                  Upload & Mint
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Layout>
  );
}