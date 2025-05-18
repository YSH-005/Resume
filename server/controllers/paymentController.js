const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Chat = require('../models/Chat');
const User = require("../models/User");
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
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    bookingId
  } = req.body;

  try {
    // ✅ Signature verification
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // ✅ Update booking with payment info
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: 'paid',
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // ✅ Auto-create chat if not exists
    const menteeId = booking.mentee;
    const mentorId = booking.mentor;

    // let existingChat = await Chat.findOne({
    //   users: { $all: [menteeId, mentorId] },
    // });

    // if (!existingChat) {
    //   await Chat.create({ users: [menteeId, mentorId] });
    // }
    // After payment is verified...

let chat = await Chat.findOne({ users: { $all: [booking.menteeId, booking.mentorId] }, booking: booking._id });

if (!chat) {
  chat = await Chat.create({ users: [booking.menteeId, booking.mentorId], booking: booking._id, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), });
}

// Update booking with chatId
booking.chatId = chat._id;
booking.status = 'paid';
await booking.save();

// Update users currentBooking
await User.findByIdAndUpdate(booking.menteeId, { currentBooking: booking._id });
await User.findByIdAndUpdate(booking.mentorId, { currentBooking: booking._id });


    res.json({ success: true, booking });
  } catch (err) {
    console.error('Error in verifyPayment:', err);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};
