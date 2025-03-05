import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/firebase";

const LogoutButton = () => {
    const navigate = useNavigate();
    const { setCurrentUser } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setCurrentUser(null); // Clear user context
            localStorage.removeItem('user'); // Example: Remove user data from local storage
            navigate('/login'); // Redirect to the login page
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <button onClick={handleLogout} className="btn btn-danger">
            Logout
        </button>
    );
};

export default LogoutButton;