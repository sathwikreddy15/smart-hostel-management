const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Parent Approval Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    parentApproval: {
        type: Boolean,
        default: false
    },
    parentApprovalDate: {
        type: Date
    },
    adminApproval: {
        type: Boolean,
        default: false
    },
    adminApprovalDate: {
        type: Date
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rejectionReason: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Virtual for checking if the leave is currently active
leaveRequestSchema.virtual('isActive').get(function() {
    const now = new Date();
    return this.status === 'Approved' && 
           now >= this.startDate && 
           now <= this.endDate;
});

// Virtual for duration in days
leaveRequestSchema.virtual('duration').get(function() {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
module.exports = LeaveRequest; 