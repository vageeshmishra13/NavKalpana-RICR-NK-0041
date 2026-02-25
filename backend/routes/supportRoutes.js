const express = require('express');
const router = express.Router();
const {
    getSupportTickets,
    createSupportTicket
} = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getSupportTickets);
router.post('/', createSupportTicket);

module.exports = router;
