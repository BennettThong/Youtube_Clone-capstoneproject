

import React, { useState, useEffect } from "react";
import {
  getAuth,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { db } from "../../Components/Firebase/firebase";

const UserProfile = () => {
  const [profilePic, setProfilePic] = useState("https://ui-avatars.com/api/?name=Bennet+Thong"); // Default avatar
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const auth = getAuth();
  const storage = getStorage();
  const user = auth.currentUser;

  // Fetch current user's stored profile URL from Firestore
  useEffect(() => {
    const fetchProfilePic = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // We expect a full download URL to be stored in Firestore
          const storedURL = userDocSnap.data().profilePicture;
          if (storedURL) {
            setProfilePic(storedURL);
          }
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) fetchProfilePic();
    });

    return () => unsubscribe();
  }, [auth, user]);

  // Handle image file selection
  const handleImageChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload new image to Firebase Storage & update Firestore with public URL
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first!");
      return;
    }

    setUploading(true);

    try {
      if (!user) {
        alert("User not logged in!");
        setUploading(false);
        return;
      }

      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload error:", error);
          setUploading(false);
        },
        async () => {
          // Get the final public download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Uploaded image URL:", downloadURL);

          // Update Firebase Auth profile (optional)
          await updateProfile(user, { photoURL: downloadURL });
          console.log("Firebase Auth Profile Updated!");

          // Update Firestore doc with the full download URL
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, { profilePicture: downloadURL });

          // Force UI refresh by reloading auth user (optional)
          await auth.currentUser.reload();

          // Update local state
          setProfilePic(downloadURL);
          setUploading(false);

          alert("Profile picture updated successfully!");
        }
      );
    } catch (error) {
      console.error("Error updating profile picture:", error);
      setUploading(false);
    }
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
            <img
              src={profilePic}
              alt="Profile Picture"
              className="object-cover w-full h-full"
            />
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
