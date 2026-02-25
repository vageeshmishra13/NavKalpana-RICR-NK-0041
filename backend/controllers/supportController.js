const SupportTicket = require('../models/SupportTicket');

// @desc    Get all support tickets for student
// @route   GET /api/support
// @access  Private
exports.getSupportTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ studentId: req.user._id }).populate('courseId', 'title');
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Private
exports.createSupportTicket = async (req, res) => {
    try {
        const { ticketType, courseId, topic, description, fileUrl } = req.body;

        const ticket = new SupportTicket({
            ticketType,
            courseId: courseId || null,
            topic,
            description,
            fileUrl,
            studentId: req.user._id,
        });

        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
