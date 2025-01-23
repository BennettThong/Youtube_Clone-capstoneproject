import React, { useState } from "react";
import { signIn } from "../../Components/Firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../Components/Firebase/firebase"; // Ensure you import auth from your firebase configuration

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const user = await signIn(email, password);
      console.log("User signed in:", user);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User Info:", result.user); // Logs user details
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={handleGoogleSignIn}>Sign In with Google</button>
    </div>
  );
};

export default SignIn;
