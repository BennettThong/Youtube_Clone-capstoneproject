import React from 'react'
import './Navbar.css'
import menu_icon from '../../assets/menu.png'
import logo from '../../assets/logo.png'
import search_icon from '../../assets/search.png'
import upload_icon from '../../assets/upload.png'
import more_icon from '../../assets/more.png'
import notification_icon from '../../assets/notification.png'
import bennett from '../../assets/bennett.jpeg'; 
import { Link } from 'react-router-dom'
import React from 'react';

const Navbar = ({ onProfileClick }) => {
    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f5f5f5' }}>
            <h1>My App</h1>
            <img
                src="default-profile-pic.png"
                alt="Profile"
                onClick={onProfileClick} // Ensure this is properly passed and handled
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                }}
            />
        </nav>
    );
};

export default Navbar;


const Navbar = ({ setSidebar }) => {

    const sidebar_toggle = (e) => {
        setSidebar((prev) => prev === false ? true : false);
    }

    return (
        <nav className='flex-div'>
            <div className="nav-left flex-div">
                <img src={menu_icon} alt="" className="menu-icon" onClick={sidebar_toggle} />
                <Link to='/'> <img src={logo} alt="" className="logo" /></Link>
            </div>
            <div className="nav-middle flex-div">
                <div className="search-box flex-div">
                    <input type="text" placeholder="Search" />
                    <img src={search_icon} alt="" />
                </div>
            </div>
            <div className="nav-right flex-div">
                <img src={upload_icon} alt="" />
                <img src={more_icon} alt="" />
                <img src={notification_icon} alt="" />
                <img src={bennett} alt="" className="user-icon" />
            </div>
        </nav>
    )
}

export default Navbar
