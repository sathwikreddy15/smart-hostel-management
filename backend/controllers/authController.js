const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, req.body.rollNumber + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Student signup
const signup = async (req, res) => {
    try {
        const {
            name,
            rollNumber,
            parentName,
            parentMobile,
            studentMobile,
            email,
            password
        } = req.body;

        // Check if student already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { rollNumber }] 
        });

        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists with this email or roll number'
            });
        }

        // Create new student
        const user = new User({
            name,
            rollNumber,
            parentName,
            parentMobile,
            studentMobile,
            email,
            password,
            role: 'student',
            photoUrl: `/uploads/${rollNumber}.jpg`
        });

        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            rollNumber: user.rollNumber,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            rollNumber: user.rollNumber,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.parentName = req.body.parentName || user.parentName;
            user.parentMobile = req.body.parentMobile || user.parentMobile;
            user.studentMobile = req.body.studentMobile || user.studentMobile;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    signup,
    login,
    getProfile,
    updateProfile,
    upload
}; 