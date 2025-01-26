import React, { useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Headers/Header";
import Home from "./Pages/Home/Home";
import Video from "./Pages/Video/Video";
import axios from 'axios';
import SignUp from "./Components/Authorization/SignUp";
import SignIn from "./Components/Authorization/SignIn";
import ImageUploader from "./Components/ImageUpload/ImageUploader";
import UserPage fr
const App = () => {
  const [user, setUser] = useState(null); // State to track the signed-in user
  const [sidebar, setSidebar] = useState(true);
  const [videos, setVideos] = useState([]);

  const onTermSubmit = async (term) => {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        q: term,
        part: 'snippet',
        maxResults: 5,
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
      },
    });
    setVideos(response.data.items);
  };

  return (
    <div>
      <Navbar setSidebar={setSidebar} />
      <Header onFormSubmit={onTermSubmit} />
      <Routes>
        <Route path="/" element={<Home sidebar={sidebar} />} />
        <Route path="/video/:categoryId/:videoId" element={<Video />} />
      </Routes>
      {/* Render search results here */}
      <div>
        {videos.map((video) => (
          <div key={video.id.videoId}>
            <h3>{video.snippet.title}</h3>
            <p>{video.snippet.description}</p>
          </div>
        ))}
      </div>
      <h1>Welcome to Firebase App</h1>
      {!user ? (
        <>
          <SignUp />
          <SignIn />
        </>
      ) : (
        <div>
          <p>Welcome, {user.email}!</p>
          <ImageUploader />
        </div>
      )}
    </div>
  );
};

export default App;
