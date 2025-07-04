const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    assignRoom,
    removeFromRoom,
    getRoomLayout
} = require('../controllers/roomController');

// Create room (admin only)
router.post('/', adminAuth, createRoom);

// Get all rooms
router.get('/', auth, getRooms);

// Get room layout by floor
router.get('/layout/:floor', auth, getRoomLayout);

// Get room by ID
router.get('/:id', auth, getRoomById);

// Update room (admin only)
router.put('/:id', adminAuth, updateRoom);

// Delete room (admin only)
router.delete('/:id', adminAuth, deleteRoom);

// Assign student to room (admin only)
router.post('/:id/assign', adminAuth, assignRoom);

// Remove student from room (admin only)
router.post('/:id/remove', adminAuth, removeFromRoom);

module.exports = router; 