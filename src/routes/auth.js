import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';

const router = express.Router();
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8080';

// Add test route for connection checking
router.get('/test', (req, res) => {
    res.json({ message: 'Auth service is working!' });
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        // Log the request for debugging
        console.log(`Attempting to register user: ${username}`);
        console.log(`Sending request to: ${USER_SERVICE_URL}/api/users/register`);
        console.log('Request body:', JSON.stringify(req.body));

        const response = await axios.post(`${USER_SERVICE_URL}/api/users/register`, { username, password });
        console.log(`User ${username} registered successfully`);
        console.log('Response:', JSON.stringify(response.data));
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error.message);
        if (error.response) {
            console.error('Error response status:', error.response.status);
            console.error('Error response data:', error.response.data);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error:', error);
        }
        
        const status = error.response?.status || 500;
        
        // Propagate the error message from the user-service, or provide a default one.
        // If the upstream response is a string, use it directly.
        // If it's an object with a 'message' property, use that.
        // Otherwise, fall back to a generic error.
        let message = 'Internal server error';
        if (error.response?.data) {
            if (typeof error.response.data === 'string') {
                message = error.response.data;
            } else if (error.response.data.message) {
                message = error.response.data.message;
            }
        }
        
        res.status(status).json({ message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        
        // Call user-service to validate user credentials
        const response = await axios.post(`${USER_SERVICE_URL}/api/users/login`, { username, password });
        const user = response.data;

        // Generate JWT
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });

    } catch (error) {
        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.response?.data || 'Invalid credentials';
        res.status(status).json({ message });
    }
});

export default router;
