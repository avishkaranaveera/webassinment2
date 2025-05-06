const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const SALT_ROUNDS = 10;

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    // ... (same logic from signup in server.js)
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    // ... (same logic from login in server.js)
};
