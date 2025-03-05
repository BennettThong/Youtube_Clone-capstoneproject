import React, { useState, useEffect } from "react";
import { useAuth } from "../../Components/Authorization/AuthContext/AuthContext";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../Components/Firebase/firebase";
import "./Navbar.css";
import menu_icon from "../../assets/menu.png";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search.png";
import upload_icon from "../../assets/upload.png";
import more_icon from "../../assets/more.png";
import notification_icon from "../../assets/notification.png";
import { Link } from "react-router-dom";


const Navbar = ({ setSidebar }) => {
  // Default avatar in case user is not logged in or no image is found
  const [profilePic, setProfilePic] = useState("https://ui-avatars.com/api/?name=Bennett+Thong");

  // Get the current user info from AuthContext
  const { currentUser } = useAuth();

  useEffect(() => {
    let unsubscribeFirestore = () => {};

    const fetchProfilePic = async (uid) => {
      if (!uid) {
        // if no user is logged in, return fallback
        setProfilePic("https://ui-avatars.com/api/?name=Bennett+Thong");
        return;
      }
      try {
        const userDocRef = doc(db, "users", uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // Since we're storing the full public URL in Firestore, just use it directly
          const { profilePicture: storedURL } = userDocSnap.data();
          if (storedURL) {
            // Append a timestamp to bust cache
            setProfilePic(`${storedURL}?t=${Date.now()}`);
          }
        } else {
          console.warn("No Firestore document found for this user!");
        }

        // Listen for real-time changes in case user updates pic again
        unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const { profilePicture: updatedURL } = docSnap.data();
            if (updatedURL) {
              setProfilePic(`${updatedURL}?t=${Date.now()}`);
            }
          }
        });
      } catch (error) {
        console.error("Error fetching profile pic:", error);
      }
    };

    // If AuthContext says we have a user, fetch their photo URL
    if (currentUser?.uid) {
      fetchProfilePic(currentUser.uid);
    } else {
      // fallback for logged-out state
      setProfilePic("https://ui-avatars.com/api/?name=Bennett+Thong");
    }

    return () => {
      // Cleanup Firestore subscription
      unsubscribeFirestore();
    };
  }, [currentUser]);

  return (
    <nav className="flex-div">
      <div className="nav-left flex-div">
        <img
          src={menu_icon}
          alt="Menu"
          className="menu-icon"
          onClick={() => setSidebar((prev) => !prev)}
        />
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
      <div className="nav-middle flex-div">
        <div className="search-box flex-div">
          <input type="text" placeholder="Search" />
          <img src={search_icon} alt="Search" />
        </div>
      </div>
      <div className="nav-right flex-div">
        <img src={upload_icon} alt="Upload" />
        <img src={more_icon} alt="More" />
        <img src={notification_icon} alt="Notifications" />
        <Link to="/profile">
          <img
            className="user-icon"
            src={profilePic}
            alt="Profile Picture"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
