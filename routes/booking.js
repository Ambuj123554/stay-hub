const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn } = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

// Middleware to check if user is customer
const isCustomer = (req, res, next) => {
    if (req.user && req.user.accountType === 'Customer') {
        next();
    } else {
        req.flash("error", "Only customers can make bookings!");
        res.redirect("/listing");
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.accountType === 'Admin') {
        next();
    } else {
        req.flash("error", "Access denied. Admin privileges required!");
        res.redirect("/listing");
    }
};

// Show booking form
router.get("/:id", isloggedIn, isCustomer, wrapAsync(bookingController.showBookingForm));

// Create booking
router.post("/:id", isloggedIn, isCustomer, wrapAsync(bookingController.createBooking));

// Generate bill
router.get("/bill/:bookingId", isloggedIn, wrapAsync(bookingController.generateBill));

// Admin dashboard route
router.get("/admin/dashboard", isloggedIn, isAdmin, wrapAsync(bookingController.adminDashboard));

module.exports = router;