import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, auth } from "../../Components/Firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { updateProfile, onAuthStateChanged } from "firebase/auth";

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [profilePic, setProfilePic] = useState(null);
  const storage = getStorage();

  // 🟢 Load user profile picture on authentication change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is logged in:", user);

        // Fetch user's stored profile picture from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data().profilePicture) {
          setProfilePic(userDocSnap.data().profilePicture);
        } else {
          // If no custom profile picture, fall back to UI Avatar
          setProfilePic(`https://ui-avatars.com/api/?name=Bennett+Thong=${encodeURIComponent(user.displayName || "User")}`);
        }
      } else {
        console.log("User is logged out");
        setProfilePic("https://ui-avatars.com/api/?name=Bennett+Thong");
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle File Selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 🟢 Upload and Update Profile Picture
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("User not logged in!");
        return;
      }

      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Upload error:", error);
        },
        async () => {
          // Get uploaded image URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Uploaded image URL:", downloadURL);

          // 🟢 Append a timestamp to prevent caching issues
          const timestampedURL = `${downloadURL}?t=${new Date().getTime()}`;

          // 🟢 Update state immediately for instant UI update
          setProfilePic(timestampedURL);

          // Update Firebase Auth Profile
          await updateProfile(user, { photoURL: timestampedURL });
          console.log("Firebase Auth Profile Updated!");

          // Update Firestore Profile
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, { profilePicture: timestampedURL });

          alert("Profile picture updated successfully!");
        }
      );
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  return (
    <div>
      <h2>Upload Profile Picture</h2>

      {profilePic ? (
        <img src={profilePic} alt="Profile" width="100" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Bennett+Thong'; }} />
      ) : (
        <p>No profile picture available</p>
      )}

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <progress value={progress} max="100" />
    </div>
  );
};

export default ImageUploader;
