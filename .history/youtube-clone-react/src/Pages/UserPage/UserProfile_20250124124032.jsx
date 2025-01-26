// pages/UserProfile.jsx
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../Components/Firebase/storage'; // Corrected import path

const UserProfile = () => {
    const [profilePicUrl, setProfilePicUrl] = useState(''); // Default profile picture URL
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `profile-pictures/${file.name}`);
            await uploadBytes(storageRef, file);

            // Get the download URL
            const downloadURL = await getDownloadURL(storageRef);
            setProfilePicUrl(downloadURL); // Update the profile picture URL
            setUploading(false);
        } catch (error) {
            console.error("Error uploading the file:", error);
            setUploading(false);
        }
    };

    const handleClick = () => {
        // Simulate a click on the hidden file input
        document.getElementById('bennett').click();
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>User Profile</h1>
            <div style={{ margin: '20px auto' }}>
                <img
                    src={profilePicUrl || 'default-profile-pic.png'}
                    alt="Profile"
                    onClick={handleClick} // Trigger the file input click
                    style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #ddd',
                        cursor: 'pointer',
                    }}
                />
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleFileChange} // Trigger upload on file selection
                />
            </div>
            <button
                onClick={handleClick}
                disabled={uploading}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    backgroundColor: uploading ? '#ccc' : '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                }}
            >
                {uploading ? 'Uploading...' : 'Change Profile Picture'}
            </button>
        </div>
    );
};

export default UserProfile;
