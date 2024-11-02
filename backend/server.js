const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Controller
const productRoutes = require('./controller/ProductController')
const reviewRoutes = require('./controller/ReviewController'); 
const cartRoutes = require('./controller/CartController'); 
const orderRoutes = require('./controller/OrderController') 
const addressRoutes = require('./controller/AddressController') 
const wishlistRoutes = require('./controller/WishlistController') 

// Import Database connection
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors()); // Use CORS middleware


// Connect to Database
connectDB();

// Middleware
app.use(express.json()); // To parse JSON bodies


// Enable Controllers
app.use('/api', productRoutes); 
app.use('/api', reviewRoutes); 
app.use('/api', cartRoutes); 
app.use('/api', orderRoutes);
app.use('/api', addressRoutes);
app.use('/api', wishlistRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

