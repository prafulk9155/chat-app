const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// Login User
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, userId: user._id }); // Include userId in response
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password field
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};
// Get All Users Excluding Current User
const getAllUsersExcludingCurrent = async (req, res) => {
    try {
        const { currentUserId } = req.query; // Expecting current user ID as query param
        const users = await User.find({ _id: { $ne: currentUserId } }, { password: 0 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};



module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getAllUsersExcludingCurrent, // Add this to exports

};
