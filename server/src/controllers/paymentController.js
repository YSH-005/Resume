const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

exports.createOrder = async (req, res) => {
  try {
    const { amount, mentorId, date, slot } = req.body;
    const menteeId = req.user.id;

    const options = {
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    const booking = new Booking({
      mentorId,
      menteeId,
      amount,
      date,
      slot,
      orderId: order.id,
    });

    await booking.save();

    res.json({ success: true, order, bookingId: booking._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create order', error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    const booking = await Booking.findByIdAndUpdate(bookingId, {
      paymentId: razorpay_payment_id,
      status: 'paid'
    });

    res.json({ success: true, message: 'Payment verified', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
