import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Feed from "../../Components/Feed/Feed";
import ImageUploader from "../../Components/ImageUpload/ImageUploader"; // Corrected import path
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Components/Firebase/firebase";
import './Home.css';

const Home = ({ sidebar }) => {
  const [category, setCategory] = useState(0);
  const [profilePic, setProfilePic] = useState("https://ui-avatars.com/api/?name=User"); // Default avatar

  const auth = getAuth();

  // 🔹 Fetch Profile Picture When User Logs In
  useEffect(() => {
    const fetchProfilePic = async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setProfilePic(userDocSnap.data().profilePicture || "https://ui-avatars.com/api/?name=User");
        }
      }
    };

    // Listen for Authentication State Changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProfilePic(user); // Fetch new profile pic when user logs in
      } else {
        setProfilePic("https://ui-avatars.com/api/?name=User"); // Reset on logout
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* 🔹 Pass updated profilePic to Sidebar */}
      <Sidebar setCategory={setCategory} sidebar={sidebar} category={category} profilePic={profilePic} />

      <div className={`container ${sidebar ? "" : " large-container"}`}>
        <Feed category={category} />
      </div>

      {/* 🔹 Add ImageUploader to allow profile picture update */}
      <ImageUploader setProfilePic={setProfilePic} />
    </>
  );
};

export default Home;
