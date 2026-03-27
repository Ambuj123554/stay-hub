const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

// Show booking form
module.exports.showBookingForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('owner');
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listing");
    }
    res.render("booking.ejs", { listing });
};

// Create booking
module.exports.createBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { customerName, checkInDate, checkOutDate, numberOfRooms, roomType } = req.body;
        
        const listing = await Listing.findById(id).populate('owner');
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listing");
        }

        // Calculate number of days
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (numberOfDays <= 0) {
            req.flash("error", "Check-out date must be after check-in date!");
            return res.redirect(`/booking/${id}`);
        }

        // Room type multipliers
        const roomMultipliers = {
            'NON AC': 1.0,
            'AC': 1.5,
            'Premium': 2.0,
            'Executive': 2.5,
            'Presidential': 3.5
        };

        const multiplier = roomMultipliers[roomType] || 1;
        const subtotal = listing.price * numberOfDays * numberOfRooms * multiplier;
        const tax = subtotal * 0.18; // 18% GST
        const totalAmount = subtotal + tax;

        const booking = new Booking({
            listing: listing._id,
            customer: req.user._id,
            customerName,
            numberOfDays,
            numberOfRooms,
            roomType,
            checkInDate,
            checkOutDate,
            totalAmount: Math.round(totalAmount)
        });

        await booking.save();
        await booking.populate(['listing', 'customer']);
        await booking.populate('listing.owner');
        
        req.flash("success", "Booking confirmed successfully!");
        res.render("booking-confirmation.ejs", { booking });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect(`/booking/${req.params.id}`);
    }
};

// Generate bill
module.exports.generateBill = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId)
            .populate('listing')
            .populate('customer')
            .populate('listing.owner');
            
        if (!booking) {
            req.flash("error", "Booking not found!");
            return res.redirect("/listing");
        }

        // Check if user is authorized to view this bill
        if (!booking.customer._id.equals(req.user._id) && req.user.accountType !== 'Admin') {
            req.flash("error", "You are not authorized to view this bill!");
            return res.redirect("/listing");
        }

        res.render("bill.ejs", { booking });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/listing");
    }
};

// Admin dashboard
module.exports.adminDashboard = async (req, res) => {
    try {
        if (req.user.accountType !== 'Admin') {
            req.flash("error", "Access denied. Admin privileges required!");
            return res.redirect("/listing");
        }

        const listings = await Listing.find({})
            .populate('owner')
            .exec();

        // Get bookings for each listing
        for (let listing of listings) {
            const bookings = await Booking.find({ listing: listing._id })
                .populate('customer')
                .sort({ bookingDate: -1 });
            listing.bookings = bookings;
        }

        res.render("admin-dashboard.ejs", { listings });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/listing");
    }
};