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
import { AuthProvider } from "./Components/Authorization/AuthContext/AuthContext";
 
const App = () => {
  const [user, setUser] = useState(null); // State to track the signed-in user
  const [sidebar, setSidebar] = useState(true);
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  // Simulated authentication check (replace with your actual logic)
  useEffect(() => {
    const loggedInUser = localStorage.getItem("user"); // Example: Retrieve user data from localStorage
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser)); // Simulate logged-in user
    }
  }, []);

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
    <AuthProvider>
      <div>
        <Navbar setSidebar={setSidebar} />
        <Header onFormSubmit={onTermSubmit} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/home" element={<Home sidebar={sidebar} />} />
          <Route path="/home/video/:categoryId/:videoId" element={<Video />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>

        {/* Render search results */}
        <div>
          {videos.map((video) => (
            <div key={video.id.videoId}>
              <h3>{video.snippet.title}</h3>
              <p>{video.snippet.description}</p>
            </div>
          ))}
        </div>

        {/* Use ImageUploader component */}
        {user && <ImageUploader />}
      </div>
    </AuthProvider>
  );
};

export default App;
