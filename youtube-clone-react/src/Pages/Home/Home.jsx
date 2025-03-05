import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Feed from "../../Components/Feed/Feed";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Components/Firebase/firebase";
import './Home.css';
import LogoutButton from "../../Components/Authorization/Buttons/LogoutButton";
import { useAuth } from "../../Components/Authorization/AuthContext/AuthContext";
import { Link } from "react-router-dom";

const Home = ({ sidebar }) => {
  const [category, setCategory] = useState(0);
  const [profilePic, setProfilePic] = useState("https://ui-avatars.com/api/?name=Bennett+Thong"); // Default avatar
  const { userLoggedIn } = useAuth();

  const auth = getAuth();

  // Fetch Profile Picture When User Logs In
  useEffect(() => {
    const fetchProfilePic = async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setProfilePic(userDocSnap.data().profilePicture || "https://ui-avatars.com/api/?name=Bennett+Thong");
        }
      }
    };

    // Listen for Authentication State Changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth State Changed: ", user); // Debugging authentication state
      if (user) {
        fetchProfilePic(user); // Fetch new profile pic when user logs in
      } else {
        setProfilePic("https://ui-avatars.com/api/?name=Bennett+Thong"); // Reset on logout
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Pass updated profilePic to Sidebar */}
      <Sidebar setCategory={setCategory} sidebar={sidebar} category={category} profilePic={profilePic} />

      <div className={`container ${sidebar ? "" : " large-container"}`}>
        <Feed category={category} />
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
    </>
  );
};

export default Home;
