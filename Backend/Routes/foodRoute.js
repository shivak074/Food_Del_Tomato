import express from 'express';
import multer from 'multer';
import { addFood, listFood, removeFood } from '../controllers/foodControllers.js';

const foodRouter = express.Router();

// Configure Multer Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Directory where uploaded files will be stored
        cb(null, './public/temp');
    },
    filename: (req, file, cb) => {
        // Generate a unique file name to avoid conflicts
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage: storage });

// Route to add a food item with an image upload
foodRouter.post('/add', upload.single('image'), addFood);

// Route to list all food items
foodRouter.get('/list', listFood);

// Route to remove a food item by ID
foodRouter.post('/remove', removeFood);

// Error handling middleware for Multer and other errors
foodRouter.use((err, req, res, next) => {
    if (err) {
        // Handle Multer-specific errors and other errors
        return res.status(400).json({ error: err.message });
    }
    // Pass other errors to the next middleware or error handler
    next();
});

export default foodRouter;
