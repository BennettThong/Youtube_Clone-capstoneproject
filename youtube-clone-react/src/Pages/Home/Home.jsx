import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Feed from "../../Components/Feed/Feed";
import ImageUploader from "../../Components/ImageUpload/ImageUploader";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Components/Firebase/firebase";
import "./Home.css";
import LogoutButton from "../../Components/Authorization/Buttons/LogoutButton";
import { useAuth } from "../../Components/Authorization/AuthContext/AuthContext";
import { Link } from "react-router-dom";

const Home = ({ sidebar }) => {
  const [category, setCategory] = useState(0);
  const [profilePic, setProfilePic] = useState(
    "https://ui-avatars.com/api/?name=User"
  ); // Default avatar
  const { userLoggedIn } = useAuth();
  const auth = getAuth();

  console.log("Rendering Home.jsx");
  console.log("userLoggedIn:", userLoggedIn); // Debugging authentication status

  // Fetch Profile Picture When User Logs In
  useEffect(() => {
    const fetchProfilePic = async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setProfilePic(
            userDocSnap.data().profilePicture ||
              "https://ui-avatars.com/api/?name=User"
          );
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
      {/* Pass updated profilePic to Sidebar */}
      <Sidebar
        setCategory={setCategory}
        sidebar={sidebar}
        category={category}
        profilePic={profilePic}
      />

      <div className={`container ${sidebar ? "" : " large-container"}`}>
        <Feed category={category} />

        {/* Always Show LogoutButton for Debugging */}
        <LogoutButton />

        {/* Conditionally Render Logout or Login Button */}
        {userLoggedIn ? (
          <LogoutButton />
        ) : (
          <Link to="/login">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
              Login
            </button>
          </Link>
        )}
      </div>

      {/* Add ImageUploader to allow profile picture update */}
      {userLoggedIn && <ImageUploader setProfilePic={setProfilePic} />}
    </>
  );
};

export default Home;
