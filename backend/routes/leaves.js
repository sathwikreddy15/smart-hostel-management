const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
    createLeaveRequest,
    getLeaveRequests,
    getLeaveRequestById,
    updateLeaveRequest,
    deleteLeaveRequest
} = require('../controllers/leaveController');

// Create leave request (students only)
router.post('/', auth, createLeaveRequest);

// Get all leave requests (filtered by role)
router.get('/', auth, getLeaveRequests);

// Get leave request by ID
router.get('/:id', auth, getLeaveRequestById);

// Update leave request status (admin only)
router.put('/:id', adminAuth, updateLeaveRequest);

// Delete leave request (admin or request creator)
router.delete('/:id', auth, deleteLeaveRequest);

module.exports = router; 