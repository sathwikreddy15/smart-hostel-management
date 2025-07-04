const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const { sendLeaveRequestToParent, sendLeaveApprovalStatus } = require('../utils/twilio');

// Create leave request
const createLeaveRequest = async (req, res) => {
    try {
        const leaveRequest = new LeaveRequest({
            ...req.body,
            student: req.user._id
        });

        await leaveRequest.save();

        // Get student details for WhatsApp message
        const student = await User.findById(req.user._id);
        
        // Send WhatsApp message to parent
        await sendLeaveRequestToParent(
            student.parentMobile,
            student.name,
            req.body.startDate,
            req.body.endDate,
            req.body.reason
        );

        res.status(201).json(leaveRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all leave requests (with filters)
const getLeaveRequests = async (req, res) => {
    try {
        const match = {};
        const sort = {};

        if (req.query.status) {
            match.status = req.query.status;
        }

        if (req.user.role === 'student') {
            match.student = req.user._id;
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        const leaveRequests = await LeaveRequest.find(match)
            .populate('student', 'name rollNumber parentMobile studentMobile')
            .populate('approvedBy', 'name')
            .sort(sort);

        res.json(leaveRequests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get leave request by ID
const getLeaveRequestById = async (req, res) => {
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id)
            .populate('student', 'name rollNumber parentMobile studentMobile')
            .populate('approvedBy', 'name');

        if (!leaveRequest) {
            return res.status(404).json({ error: 'Leave request not found' });
        }

        // Check if user is authorized to view this leave request
        if (req.user.role === 'student' && leaveRequest.student._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        res.json(leaveRequest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update leave request status
const updateLeaveRequest = async (req, res) => {
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id)
            .populate('student', 'name studentMobile');

        if (!leaveRequest) {
            return res.status(404).json({ error: 'Leave request not found' });
        }

        // Only admin can update status
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const { status, parentApproval } = req.body;

        if (status) {
            leaveRequest.status = status;
            if (status === 'Approved') {
                leaveRequest.approvedBy = req.user._id;
                leaveRequest.adminApproval = true;
                leaveRequest.adminApprovalDate = new Date();
            }
        }

        if (parentApproval !== undefined) {
            leaveRequest.parentApproval = parentApproval;
            if (parentApproval) {
                leaveRequest.parentApprovalDate = new Date();
            }
        }

        await leaveRequest.save();

        // Send WhatsApp notification to student
        if (status === 'Approved' || status === 'Rejected') {
            await sendLeaveApprovalStatus(
                leaveRequest.student.studentMobile,
                status.toLowerCase(),
                leaveRequest.startDate,
                leaveRequest.endDate
            );
        }

        res.json(leaveRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete leave request
const deleteLeaveRequest = async (req, res) => {
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id);

        if (!leaveRequest) {
            return res.status(404).json({ error: 'Leave request not found' });
        }

        // Only allow student who created the request or admin to delete
        if (leaveRequest.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await leaveRequest.remove();
        res.json({ message: 'Leave request deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createLeaveRequest,
    getLeaveRequests,
    getLeaveRequestById,
    updateLeaveRequest,
    deleteLeaveRequest
}; 