import React, { useState } from 'react';
import useShowToast from './useShowToast';

const useImagePreview = () => {
  const [imageURL, setImageURL] = useState(null);
  const showToast = useShowToast();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // console.log('file is: ', file);
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log('Invalid file type');
      showToast('Invalid file type', 'Please select an image file', 'error');
      setImageURL(null);
    }
  };
  // console.log('Image URL is: ', imageURL);
  return { handleImageChange, imageURL, setImageURL };
};

export default useImagePreview;
