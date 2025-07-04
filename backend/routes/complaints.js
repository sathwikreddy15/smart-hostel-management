const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    voteComplaint
} = require('../controllers/complaintController');

// Create complaint (students only)
router.post('/', auth, createComplaint);

// Get all complaints (with filters)
router.get('/', auth, getComplaints);

// Get complaint by ID
router.get('/:id', auth, getComplaintById);

// Update complaint (admin or complaint creator)
router.put('/:id', auth, updateComplaint);

// Delete complaint (admin or complaint creator)
router.delete('/:id', auth, deleteComplaint);

// Vote on complaint (students only)
router.post('/:id/vote', auth, voteComplaint);

module.exports = router; 