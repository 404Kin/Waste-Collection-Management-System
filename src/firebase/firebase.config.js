import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCK0x3CPva9LlL4GyR4qQK8erwRQg3Qvkc",
  authDomain: "wastecollection-fe6a3.firebaseapp.com",
  projectId: "wastecollection-fe6a3",
  storageBucket: "wastecollection-fe6a3.firebasestorage.app",
  messagingSenderId: "385837846201",
  appId: "1:385837846201:web:9724b6b2599b68bea05568",
  measurementId: "G-NPBM6PFHNJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export const registerUser = async (email, password, name, phone) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: name,
      phoneNumber: phone
    });
    
    
    await saveUserToMongoDB(userCredential.user);
    
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


export const saveUserToMongoDB = async (user) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: user.uid,
        name: user.displayName || user.email || 'User',
        email: user.email,
        phone: user.phoneNumber || ''
      })
    });
    return await response.json();
  } catch (error) {
    console.error('❌ Save user error:', error);
    return { success: false, error: error.message };
  }
};

export const savePickupToMongoDB = async (pickupData) => {
  try {
    const response = await fetch(`${API_URL}/pickups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pickupData)
    });
    return await response.json();
  } catch (error) {
    console.error('❌ Save pickup error:', error);
    return { success: false, error: error.message };
  }
};

export const getPickupsFromMongoDB = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/pickups?userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Get pickups error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserFromMongoDB = async (uid) => {
  try {
    const response = await fetch(`${API_URL}/auth/me?uid=${uid}`);
    return await response.json();
  } catch (error) {
    console.error('❌ Get user error:', error);
    return { success: false, error: error.message };
  }
};

export const getRecyclingCenters = async () => {
  try {
    const response = await fetch(`${API_URL}/recycling-centers`);
    const data = await response.json();
    console.log('📥 Recycling Centers:', data);
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
    return { success: false, error: error.message };
  }
};


export { auth, onAuthStateChanged };