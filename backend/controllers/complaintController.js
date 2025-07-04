const Complaint = require('../models/Complaint');

// Create new complaint
const createComplaint = async (req, res) => {
    try {
        const complaint = new Complaint({
            ...req.body,
            student: req.user._id
        });

        await complaint.save();
        res.status(201).json(complaint);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all complaints (with filters)
const getComplaints = async (req, res) => {
    try {
        const match = {};
        const sort = {};

        if (req.query.status) {
            match.status = req.query.status;
        }

        if (req.query.type) {
            match.type = req.query.type;
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        const complaints = await Complaint.find(match)
            .populate('student', 'name rollNumber')
            .populate('resolvedBy', 'name')
            .sort(sort);

        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get complaint by ID
const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('student', 'name rollNumber')
            .populate('resolvedBy', 'name');

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        res.json(complaint);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update complaint
const updateComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        // Only allow student who created the complaint or admin to update
        if (complaint.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const updates = Object.keys(req.body);
        updates.forEach((update) => complaint[update] = req.body[update]);

        if (req.body.status === 'Resolved') {
            complaint.resolvedAt = new Date();
            complaint.resolvedBy = req.user._id;
        }

        await complaint.save();
        res.json(complaint);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete complaint
const deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        // Only allow student who created the complaint or admin to delete
        if (complaint.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await complaint.remove();
        res.json({ message: 'Complaint deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Vote on complaint
const voteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found' });
        }

        const { voteType } = req.body; // 'upvote' or 'downvote'
        const userId = req.user._id;

        // Remove existing votes by this user
        complaint.upvotes = complaint.upvotes.filter(id => id.toString() !== userId.toString());
        complaint.downvotes = complaint.downvotes.filter(id => id.toString() !== userId.toString());

        // Add new vote
        if (voteType === 'upvote') {
            complaint.upvotes.push(userId);
        } else if (voteType === 'downvote') {
            complaint.downvotes.push(userId);
        }

        await complaint.save();
        res.json(complaint);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    voteComplaint
}; 