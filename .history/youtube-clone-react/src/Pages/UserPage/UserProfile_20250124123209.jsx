// pages/UserProfile.jsx
import React, { useState } from 'react';
import ImageUploader from '../components/ImageUploader';

const UserProfile = () => {
    const [profilePicUrl, setProfilePicUrl] = useState('');

    const handleImageUpload = (url) => {
        setProfilePicUrl(url);
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>User Profile</h1>
            <div style={{ margin: '20px auto' }}>
                <img
                    src={profilePicUrl || 'default-profile-pic.png'}
                    alt="Profile"
                    style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #ddd',
                    }}
                />
            </div>
            <ImageUploader onUpload={handleImageUpload} />
        </div>
    );
};

export default UserProfile;
