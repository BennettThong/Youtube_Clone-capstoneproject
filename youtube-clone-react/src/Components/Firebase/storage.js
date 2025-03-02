import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import firebaseApp from "./firebase";

// Initialize Firebase services
const storage = getStorage(firebaseApp);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export const uploadImage = async (file) => {
  if (!file) {
    throw new Error("No file selected!");
  }

  const user = auth.currentUser; // Get logged-in user
  if (!user) {
    throw new Error("User not authenticated!");
  }

  try {
    // Create a reference in Firebase Storage
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    
    // Upload file to Firebase Storage
    await uploadBytes(storageRef, file);
    
    // Get download URL of uploaded file
    const imageUrl = await getDownloadURL(storageRef);

    // Update Firestore with the new profile image URL
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { profilePicture: imageUrl });

    console.log("Profile picture updated successfully:", imageUrl);
    return imageUrl;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

// Export storage for use in other parts of the app
export { storage };
export default storage;
