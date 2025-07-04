const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true
    },
    floor: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true,
        enum: [2, 3] // Two-person or three-person rooms
    },
    occupants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isOccupied: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['two-person', 'three-person'],
        required: true
    }
}, {
    timestamps: true
});

// Virtual for checking if room is full
roomSchema.virtual('isFull').get(function() {
    return this.occupants.length >= this.capacity;
});

// Middleware to update isOccupied status
roomSchema.pre('save', function(next) {
    this.isOccupied = this.occupants.length > 0;
    next();
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room; 