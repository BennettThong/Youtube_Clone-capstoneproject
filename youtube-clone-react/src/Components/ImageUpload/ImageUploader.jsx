import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, auth } from "../../Components/Firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [profilePic, setProfilePic] = useState("https://ui-avatars.com/api/?name=Bennet+Thong"); // Default avatar

  const auth = getAuth();
  const storage = getStorage();

  // 🔹 Fetch Profile Picture When Auth State Changes
  useEffect(() => {
    const fetchProfilePic = async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setProfilePic(userDocSnap.data().profilePicture || "https://ui-avatars.com/api/?name=Bennet+Thong");
        }
      }
    };

    // 🔹 Listen for Authentication State Changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProfilePic(user); // Fetch new profile pic on login
      } else {
        setProfilePic("https://ui-avatars.com/api/?name=Bennet+Thong"); // Reset on logout
      }
    });

    return () => unsubscribe();
  }, [auth]); // 🔹 Only runs when `auth` changes

  // Handle File Selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // 🔹 Upload and Update Profile Picture
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
          // Get the uploaded image URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Uploaded image URL:", downloadURL);
          
          // 🟢 Use downloadURL instead of auth.currentUser.photoURL
          setProfilePic(`${downloadURL}?t=${new Date().getTime()}`); // Avoid browser caching

          // Update Firebase Auth Profile
          await updateProfile(user, { photoURL: downloadURL });
          console.log("Firebase Auth Profile Updated!");

          // Update Firestore Profile
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, { profilePicture: downloadURL });

          // 🟢 Force UI refresh by triggering auth change
          await auth.currentUser.reload();

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
        <img src={profilePic} alt="Profile" width="100" />
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
