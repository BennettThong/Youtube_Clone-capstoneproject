import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../Firebase/firebase";
import { useAuth } from "../../Authorization/AuthContext/AuthContext";

const Login = () => {
    const { userLoggedIn, login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // 🔹 Handle Email/Password Login
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            setErrorMessage(""); // Clear previous errors
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                console.log("User logged in:", user);
                login({ email: user.email, uid: user.uid }); // Store user data
            } catch (error) {
                setErrorMessage(error.message);
                setIsSigningIn(false);
            }
        }
    };

    // 🔹 Handle Google Login
    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            setErrorMessage(""); // Clear previous errors
            try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const user = result.user;
                console.log("Google User logged in:", user);
                login({ email: user.email, uid: user.uid }); // Store user data
            } catch (error) {
                setErrorMessage(error.message);
                setIsSigningIn(false);
            }
        }
    };

    return (
        <div>
            {userLoggedIn && (<Navigate to="/home" replace={true} />)}

            <div className="min-h-screen bg-no-repeat bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486520299386-6d106b22014b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHxlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')" }}>
                <div className="flex justify-end">
                    <div className="bg-white min-h-screen w-1/2 flex justify-center items-center">
                        <div>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <span className="text-sm text-gray-900">Welcome back</span>
                                    <h1 className="text-2xl font-bold">Login to your account</h1>
                                </div>
                                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                                <div className="mt-5">
                                    <label className="block text-md mb-2" htmlFor="email">Email</label>
                                    <input className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="my-3">
                                    <label className="block text-md mb-2" htmlFor="password">Password</label>
                                    <input className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <input className="cursor-pointer" type="checkbox" name="rememberme" />
                                        <span className="text-sm"> Remember Me</span>
                                    </div>
                                    <span className="text-sm text-blue-700 hover:underline cursor-pointer">Forgot password?</span>
                                </div>
                                <div className="mt-4">
                                    <button type="submit"
                                        className="mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100"
                                        disabled={isSigningIn}>
                                        {isSigningIn ? "Logging in..." : "Login"}
                                    </button>
                                    <div className="flex space-x-2 justify-center items-center bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition duration-100 cursor-pointer"
                                        onClick={onGoogleSignIn}>
                                        <img className="h-5" src="https://i.imgur.com/arC60SB.png" alt="Google Logo" />
                                        <span>{isSigningIn ? "Signing in..." : "Or sign in with Google"}</span>
                                    </div>
                                </div>
                            </form>
                            <p className="mt-8"> Don't have an account? <Link to="/register" className="text-blue-600">Join free today</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;