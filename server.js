// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS middleware

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://radiant:deeptimaan@cluster0.luau7c9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/hotel_booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define MongoDB schema
const bookingSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    phone: String,
    checkin: Date,
    checkout: Date,
    roomtype: String
});

// Create MongoDB model
const Booking = mongoose.model('Booking', bookingSchema);

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle POST request to /posted
app.post('/posted', async (req, res) => {
    try {
        // Create new booking document
        const booking = new Booking({
            fullname: req.body.fullname,
            email: req.body.email,
            phone: req.body.phone,
            checkin: req.body.checkin,
            checkout: req.body.checkout,
            roomtype: req.body.roomtype
        });

        // Save booking to the database
        await booking.save();

        // Send success response
        res.status(201).send('Booking successful!');
    } catch (error) {
        // Send error response
        console.error('Error occurred while saving booking:', error);
        res.status(500).send('Error occurred while booking. Please try again.');
    }
});
app.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find(); // Fetch all bookings from the database
        res.json(bookings); // Respond with the bookings in JSON format
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).send('Error fetching bookings');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
