import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Header from "./Components/Headers/Header";
import Home from "./Pages/Home/Home";
import Video from "./Pages/Video/Video";
import axios from "axios";
import ImageUploader from "./Components/ImageUpload/ImageUploader";
import UserProfile from "./Pages/UserPage/UserProfile";
import Login from "./Components/Authorization/Login/LoginPage";
import Registration from "./Components/Authorization/Register/Registration";
import { useAuth } from "./Components/Authorization/AuthContext/AuthContext";
import LogoutButton from "./Components/Authorization/Buttons/LogoutButton";

const App = () => {
  const [sidebar, setSidebar] = useState(true);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const auth = useAuth(); // ✅ Ensure auth is defined

  if (!auth) {
    return <p>Loading...</p>; // ✅ Handle undefined auth case
  }

  const { userLoggedIn } = auth;

  console.log("App.js: userLoggedIn:", userLoggedIn); // Debugging user authentication

  const onTermSubmit = async (term) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            q: term,
            part: "snippet",
            maxResults: 5,
            key: process.env.REACT_APP_YOUTUBE_API_KEY,
          },
        }
      );
      setVideos(response.data.items);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div>
      <Navbar setSidebar={setSidebar} />
      <Header onFormSubmit={onTermSubmit} />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route 
          path="/login" 
          element={userLoggedIn ? <Navigate to="/home" replace /> : <Login />} 
        />
        <Route path="/register" element={<Registration />} />
        <Route path="/home" element={<Home sidebar={sidebar} />} />
        <Route path="/home/video/:categoryId/:videoId" element={<Video />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>

      {/* Show Logout Button in App Footer */}
      {userLoggedIn && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <LogoutButton />
        </div>
      )}

      {/* Render search results */}
      <div>
        {videos.map((video) => (
          <div key={video.id.videoId}>
            <h3>{video.snippet.title}</h3>
            <p>{video.snippet.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
