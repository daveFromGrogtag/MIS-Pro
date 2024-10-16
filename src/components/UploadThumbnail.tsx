// Please take this code and give me 

import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UploadThumbnail = ({ onThumbnailUrlChange }) => {
  const [file, setFile] = useState(null);
  const storage = getStorage();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const generateThumbnail = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 100;
          canvas.height = 100;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 100, 100);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to generate thumbnail'));
            }
          }, 'image/png');
        };
        img.onerror = () => reject(new Error('Image load error'));
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      const thumbnailBlob = await generateThumbnail(file);
      const thumbnailRef = ref(storage, `thumbnails/${file.name.split('.')[0]}_thumbnail.png`);
      await uploadBytes(thumbnailRef, thumbnailBlob);
      const url = await getDownloadURL(thumbnailRef);
      onThumbnailUrlChange(url);  // Call the parent function
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
    }
  };

  return (
    <div>
      <input type="file" accept=".png,.jpeg,.jpg,.pdf" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Generate Thumbnail</button>
      {/* <canvas id='pdfCanvas'></canvas> */}
    </div>
  );
};

export default UploadThumbnail;