const Booking = require('../models/Booking');
const Chat = require('../models/Chat');

async function deactivateExpiredBookings() {
  try {
    const now = new Date();

    const expiredBookings = await Booking.find({
      date: { $lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      paymentStatus: 'paid',
      chatActive: true,
    });

    for (const booking of expiredBookings) {
      booking.chatActive = false;
      await booking.save();

      // Find the chat between mentor and mentee and set isActive = false
      const chat = await Chat.findOne({
        users: { $all: [booking.mentorId, booking.menteeId] }
      });
      if (chat) {
        chat.isActive = false;
        await chat.save();
      }
    }

    console.log(`Deactivated ${expiredBookings.length} expired bookings and closed chats.`);
  } catch (error) {
    console.error('Error deactivating expired bookings:', error);
  }
}
