import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../Components/Authorization/AuthContext/AuthContext';
import { storage } from "../../Components/Firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const UserProfile = () => {
    const { currentUser } = useContext(AuthContext);
    const [profilePicUrl, setProfilePicUrl] = useState(''); // Default profile picture URL
    const [uploading, setUploading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null); // State to handle selected image

    useEffect(() => {
      if (currentUser && currentUser.photoURL) {
        setProfilePicUrl(currentUser.photoURL);
      }
    }, [currentUser]);
  
    // Handle image selection
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageURL = URL.createObjectURL(file); // Preview the selected image
        setSelectedImage(imageURL);
      }
    };
  
    // Placeholder upload logic (implement Firebase or other backend logic here)
    const handleUpload = () => {
      if (!selectedImage) {
        alert("Please select an image first.");
        return;
      }
      setUploading(true);
      // Simulate upload process
      setTimeout(() => {
        alert("Image uploaded successfully!");
        setUploading(false);
        setProfilePicUrl(selectedImage); // Set the uploaded image as the profile picture
      }, 2000);
    };
  
    return (
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold text-center text-gray-700 mb-4">
            User Profile
          </h1>
  
          {/* Profile Picture Preview */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-4">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Selected Profile"
                  className="object-cover w-full h-full"
                />
              ) : (
                profilePicUrl ? (
                  <img
                    src={profilePicUrl}
                    alt="Profile Picture"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )
              )}
            </div>
  
            <label
              htmlFor="imageUpload"
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm"
            >
              Choose Image
            </label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
  
          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full py-2 px-4 rounded-lg text-sm ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>
    );
  };
  
  export default UserProfile;