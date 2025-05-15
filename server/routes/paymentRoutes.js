const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const {protect,isMentee,isMentor} = require('../middleware/auth');

//  Only logged-in mentees can create payment orders
router.post('/create-order', protect, isMentee, createOrder);
router.post('/verify-payment', protect, isMentee, verifyPayment);

module.exports = router;
