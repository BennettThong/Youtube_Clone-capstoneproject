import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { getFirestore, doc, getDoc, onSnapshot } from "firebase/firestore";
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
  const [profilePic, setProfilePic] = useState("https://ui-avatars.com/api/?name=Bennet+Thong"); // Default avatar
  const auth = getAuth();

  useEffect(() => {
    let unsubscribeFirestore = () => {}; // Placeholder for cleanup
  
    const fetchProfilePic = async () => {
      const user = auth.currentUser; // ✅ Get the authenticated user
      if (!user || !user.uid) {
        console.error("❌ No authenticated user found!");
        return;
      }
  
      console.log("👤 Authenticated User UID:", user.uid);
  
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
  
      if (userDocSnap.exists()) {
        const storedImageUrl = userDocSnap.data().profilePicture;
        console.log("📸 Firestore Retrieved Profile Picture:", storedImageUrl);
  
        if (storedImageUrl) {
          const newProfilePic = `${storedImageUrl}?t=${new Date().getTime()}`;
          console.log("🔄 Setting Profile Picture:", newProfilePic);
          setProfilePic(newProfilePic);
        }
      } else {
        console.warn("⚠️ No Firestore document found for this user!");
      }
  
      // 🔹 Listen for Firestore Profile Picture Updates in Real-Time
      unsubscribeFirestore = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const updatedImageUrl = docSnap.data().profilePicture;
          console.log("📡 Firestore Updated Profile Picture:", updatedImageUrl);
  
          if (updatedImageUrl) {
            setProfilePic(`${updatedImageUrl}?t=${new Date().getTime()}`);
          }
        }
      });
    };
  
    // 🔹 Listen for Authentication State Changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("✅ User Logged In:", user.uid);
        fetchProfilePic(); // ✅ Ensure user data is fully loaded
      } else {
        console.log("❌ No User Logged In - Using Default Image");
        setProfilePic("https://ui-avatars.com/api/?name=Bennet+Thong");
      }
    });
  
    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, [auth]);
  
  

  return (
    <nav className="flex-div">
      <div className="nav-left flex-div">
        <img src={menu_icon} alt="Menu" className="menu-icon" onClick={() => setSidebar((prev) => !prev)} />
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
<Link to="/profile">
  <img
    className="user-icon"
    src={`${profilePic}&cache=${new Date().getTime()}`} 
    alt="Profile Picture" 
    width="50" 
    height="50" 
    style={{ borderRadius: "50%", objectFit: "cover" }}
  />
</Link>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
