const Room = require('../models/Room');
const User = require('../models/User');

// Create room (admin only)
const createRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all rooms (with filters)
const getRooms = async (req, res) => {
    try {
        const match = {};
        const sort = {};

        if (req.query.floor) {
            match.floor = parseInt(req.query.floor);
        }

        if (req.query.type) {
            match.type = req.query.type;
        }

        if (req.query.isOccupied !== undefined) {
            match.isOccupied = req.query.isOccupied === 'true';
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        const rooms = await Room.find(match)
            .populate('occupants', 'name rollNumber')
            .sort(sort);

        res.json(rooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get room by ID
const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
            .populate('occupants', 'name rollNumber');

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update room
const updateRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const updates = Object.keys(req.body);
        updates.forEach((update) => room[update] = req.body[update]);

        await room.save();
        res.json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete room
const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        if (room.occupants.length > 0) {
            return res.status(400).json({ error: 'Cannot delete occupied room' });
        }

        await room.remove();
        res.json({ message: 'Room deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Assign student to room
const assignRoom = async (req, res) => {
    try {
        const { studentId } = req.body;
        const room = await Room.findById(req.params.id);
        const student = await User.findById(studentId);

        if (!room || !student) {
            return res.status(404).json({ error: 'Room or student not found' });
        }

        if (room.occupants.length >= room.capacity) {
            return res.status(400).json({ error: 'Room is full' });
        }

        if (student.room) {
            return res.status(400).json({ error: 'Student already assigned to a room' });
        }

        room.occupants.push(studentId);
        student.room = room._id;

        await room.save();
        await student.save();

        res.json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Remove student from room
const removeFromRoom = async (req, res) => {
    try {
        const { studentId } = req.body;
        const room = await Room.findById(req.params.id);
        const student = await User.findById(studentId);

        if (!room || !student) {
            return res.status(404).json({ error: 'Room or student not found' });
        }

        room.occupants = room.occupants.filter(id => id.toString() !== studentId);
        student.room = null;

        await room.save();
        await student.save();

        res.json(room);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get room layout
const getRoomLayout = async (req, res) => {
    try {
        const { floor } = req.params;
        const rooms = await Room.find({ floor })
            .populate('occupants', 'name rollNumber')
            .sort('roomNumber');

        const layout = {
            floor: parseInt(floor),
            totalRooms: rooms.length,
            twoPersonRooms: rooms.filter(r => r.type === 'two-person').length,
            threePersonRooms: rooms.filter(r => r.type === 'three-person').length,
            occupiedRooms: rooms.filter(r => r.isOccupied).length,
            rooms: rooms
        };

        res.json(layout);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createRoom,
    getRooms,
    getRoomById,
    updateRoom,
    deleteRoom,
    assignRoom,
    removeFromRoom,
    getRoomLayout
}; 