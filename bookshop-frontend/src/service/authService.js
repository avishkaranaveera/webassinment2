// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth/';

// --- MODIFIED: Accepts username, email, password ---
const signup = (username, email, password) => {
    // --- MODIFIED: Sends username, email, password ---
    return axios.post(API_URL + 'signup', {
        username, // Added username
        email,
        password,
    });
};

// --- login function remains unchanged ---
const login = async (email, password) => { // Still takes email
    const response = await axios.post(API_URL + 'login', {
        email,
        password,
    });

    if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        // The user object from backend now includes username
        localStorage.setItem('userInfo', JSON.stringify(response.data.user));
        console.log("Token stored:", response.data.token);
        console.log("User info stored:", response.data.user); // Will now show {id, email, username}
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    console.log("Logged out, items removed from localStorage");
};

const getCurrentUserToken = () => {
    return localStorage.getItem('userToken');
};

 const getCurrentUserInfo = () => {
    const info = localStorage.getItem('userInfo');
    try {
        // The parsed object might now have 'username' if login was successful
        return info ? JSON.parse(info) : null;
    } catch (e) {
        console.error("Error parsing user info from localStorage", e);
        return null;
    }
};

const authService = {
    signup,
    login,
    logout,
    getCurrentUserToken,
    getCurrentUserInfo
};

export default authService;