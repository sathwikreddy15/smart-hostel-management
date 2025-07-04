const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Access denied. Admin only.' });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate as admin.' });
    }
};

const studentAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (req.user.role !== 'student') {
                return res.status(403).json({ error: 'Access denied. Students only.' });
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate as student.' });
    }
};

module.exports = {
    auth,
    adminAuth,
    studentAuth
}; 