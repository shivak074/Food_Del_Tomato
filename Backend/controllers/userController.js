import userModel from "../model/userModel.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt"; 

const createToken = async (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '4d' });
};

const createRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Refresh token with longer expiry
};

const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        return decoded.id;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User Already Exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter a valid Email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please Enter a strong password" });
        }

        const newUser = new userModel({
            name: name,
            email: email,
            password: password
        });

        const user = await newUser.save();

        const token = await createToken(user._id);
        const refreshToken = createRefreshToken(user._id);

        res.json({ success: true, token, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error registering user" });
    }
};

const loginUser = async (req, res) => {
    const { password, email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = await createToken(user._id);
        const refreshToken = createRefreshToken(user._id);

        res.json({ success: true, token});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error logging in user" });
    }
};

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    try {
        const userId = verifyRefreshToken(refreshToken);
        const newAccessToken = await createToken(userId);
        res.json({ success: true, token: newAccessToken });
    } catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser};
