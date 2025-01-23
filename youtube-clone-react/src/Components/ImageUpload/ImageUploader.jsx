import React, { useState } from "react";
import { uploadImage } from "../../Components/Firebase/storage";

const ImageUploader = () => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (file) {
      try {
        const url = await uploadImage(file);
        console.log("Uploaded image URL:", url);
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ImageUploader;
