const Booking = require("../Models/bookingModel");

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name phone email")
      .populate("suit", "name category size color dailyRate")
      .populate("handledBy", "name email role")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name phone email")
      .populate("suit", "name category size color dailyRate")
      .populate("handledBy", "name email role");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const createBooking = async (req, res) => {
  try {
    const {
      customer,
      customerName,
      phone,
      suit,
      size,
      eventType,
      pickupDate,
      deposit,
      status,
      notes,
    } = req.body;

    const eventDate = req.body.eventDate || req.body.bookingDate || new Date();
    const returnDate = req.body.returnDate || new Date(new Date(eventDate).getTime() + 86400000 * 3);
    const totalAmount = req.body.totalAmount !== undefined ? req.body.totalAmount : (req.body.price !== undefined ? req.body.price : 0);

    if (!suit) {
      return res.status(400).json({ message: "Suit is required for booking" });
    }

    const booking = await Booking.create({
      customer: customer || undefined,
      customerName,
      phone,
      suit,
      size: size || "M",
      eventDate,
      eventType: eventType || "Other",
      pickupDate: pickupDate || eventDate,
      returnDate,
      totalAmount: Number(totalAmount),
      deposit: deposit || 0,
      status: status || "Reserved",
      handledBy: req.user ? (req.user._id || req.user.id) : undefined,
      notes,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("customer", "name phone email")
      .populate("suit", "name category size color dailyRate")
      .populate("handledBy", "name email role");

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateBooking = async (req, res) => {
  try {
    const {
      customer,
      suit,
      eventDate,
      eventType,
      pickupDate,
      returnDate,
      totalAmount,
      deposit,
      status,
      notes,
    } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (customer) booking.customer = customer;
    if (suit) booking.suit = suit;
    if (eventDate) booking.eventDate = eventDate;
    if (eventType) booking.eventType = eventType;
    if (pickupDate) booking.pickupDate = pickupDate;
    if (returnDate) booking.returnDate = returnDate;
    if (totalAmount !== undefined) booking.totalAmount = totalAmount;
    if (deposit !== undefined) booking.deposit = deposit;
    if (status) booking.status = status;
    if (notes !== undefined) booking.notes = notes;
    if (req.user) booking.handledBy = req.user._id || req.user.id;

    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate("customer", "name phone email")
      .populate("suit", "name category size color dailyRate")
      .populate("handledBy", "name email role");

    res.json(populatedBooking);
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    if (req.user) booking.handledBy = req.user._id || req.user.id;
    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate("customer", "name phone email")
      .populate("suit", "name category size color dailyRate")
      .populate("handledBy", "name email role");

    res.json(populatedBooking);
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json({ message: "Booking removed successfully", _id: req.params.id });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {getBookings,getBooking, createBooking, updateBooking, updateBookingStatus, deleteBooking};
