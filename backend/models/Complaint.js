const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Maintenance', 'Food', 'Cleanliness', 'Security', 'Other']
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Resolved'],
        default: 'Pending'
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    resolvedAt: {
        type: Date
    },
    resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Virtual for vote count
complaintSchema.virtual('voteCount').get(function() {
    return this.upvotes.length - this.downvotes.length;
});

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint; 