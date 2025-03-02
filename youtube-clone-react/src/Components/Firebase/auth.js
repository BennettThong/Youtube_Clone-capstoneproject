import { getAuth, signOut } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { firebaseApp } from "./firebase"; // Ensure firebase is properly initialized

// Initialize Firebase services
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// 🔹 Monitor authentication state changes (needed for ImageUploader)
export const listenToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? user : null);
  });
};

// 🔹 Create a new user with email & password
export const doCreateUserWithEmailAndPassword = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  // 🔹 Store user data in Firestore
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    profilePicture: "",
  });

  return userCredential;
};

// 🔹 Sign in a user with email & password
export const doSignInWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 🔹 Google Sign-In & Store in Firestore
export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // 🔹 Check if user already exists in Firestore
  const userDocRef = doc(db, "users", user.uid);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    // 🔹 If user is new, create Firestore record
    await setDoc(userDocRef, {
      email: user.email,
      profilePicture: user.photoURL || "",
    });
  }

  return user;
};

// 🔹 Function to Upload Profile Picture & Update Firestore
export const uploadProfilePicture = async (file) => {
  if (!file) throw new Error("No file selected!");

  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated!");

  try {
    // 🔹 Create a reference in Firebase Storage
    const storageRef = ref(storage, `profilePictures/${user.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // 🔹 Wait for the upload to complete
    await uploadTask;

    // 🔹 Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // 🔹 Update Firebase Auth Profile
    await updateProfile(user, { photoURL: downloadURL });

    // 🔹 Update Firestore Profile
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, { profilePicture: downloadURL });

    // 🔹 Force refresh auth state
    await auth.currentUser.reload();

    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

// 🔹 Sign out a user
export const doSignOut = async () => {
  return signOut(auth);
};

// 🔹 Reset password
export const doPasswordReset = async (email) => {
  return sendPasswordResetEmail(auth, email);
};

// 🔹 Change password
export const doPasswordChange = async (password) => {
  return updatePassword(auth.currentUser, password);
};

// 🔹 Send email verification
export const doSendEmailVerification = async () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/home`,
  });
};

// Export Firebase Auth, Firestore, and Storage instances
export { auth, db, storage };
export default auth;
