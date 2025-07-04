const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeIn: {
        type: Date
    },
    timeOut: {
        type: Date
    },
    isPresent: {
        type: Boolean,
        default: true
    },
    isLate: {
        type: Boolean,
        default: false
    },
    isOnLeave: {
        type: Boolean,
        default: false
    },
    parentNotified: {
        type: Boolean,
        default: false
    },
    notificationTime: {
        type: Date
    },
    recognitionConfidence: {
        type: Number,
        min: 0,
        max: 1
    }
}, {
    timestamps: true
});

// Index for efficient querying
attendanceSchema.index({ student: 1, date: 1 });

// Virtual for duration in hostel
attendanceSchema.virtual('duration').get(function() {
    if (this.timeIn && this.timeOut) {
        return (this.timeOut - this.timeIn) / (1000 * 60 * 60); // Duration in hours
    }
    return 0;
});

// Static method to check if student was in hostel at a specific time
attendanceSchema.statics.wasInHostel = async function(studentId, checkTime) {
    const attendance = await this.findOne({
        student: studentId,
        date: {
            $gte: new Date(checkTime.getFullYear(), checkTime.getMonth(), checkTime.getDate()),
            $lt: new Date(checkTime.getFullYear(), checkTime.getMonth(), checkTime.getDate() + 1)
        },
        timeIn: { $lte: checkTime },
        $or: [
            { timeOut: { $gte: checkTime } },
            { timeOut: null }
        ]
    });
    return !!attendance;
};

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance; 