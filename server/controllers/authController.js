import User from '../models/User.js';
import Store from '../models/Store.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
    try {
        const { name, email, password, phone, storeName, storeAddress, gstNumber } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        // Check if GST number already exists
        const existingStore = await Store.findOne({ gstNumber });
        if (existingStore) {
            return res.status(400).json({
                success: false,
                message: 'A store with this GST number already exists',
            });
        }

        // Validate GST number format if provided
        if (gstNumber) {
            const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
            if (!gstRegex.test(gstNumber)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid GST number format',
                });
            }
        }

        // Check if profile is complete
        const isProfileComplete = !!(storeName && storeAddress && gstNumber);

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            storeName,
            storeAddress,
            gstNumber,
            isProfileComplete,
        });

        // Create store record if all store details are provided
        if (isProfileComplete) {
            await Store.create({
                owner: user._id,
                storeName,
                storeAddress,
                gstNumber,
                phone,
                email,
            });
        }

        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email and password',
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save({ validateBeforeSave: false });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            storeName: req.body.storeName,
            storeAddress: req.body.storeAddress,
            gstNumber: req.body.gstNumber,
        };

        // Check if profile is being completed
        if (req.body.storeName && req.body.storeAddress && req.body.gstNumber) {
            fieldsToUpdate.isProfileComplete = true;

            // Check if store already exists
            const existingStore = await Store.findOne({ owner: req.user.id });

            if (existingStore) {
                // Update existing store
                await Store.findOneAndUpdate(
                    { owner: req.user.id },
                    {
                        storeName: req.body.storeName,
                        storeAddress: req.body.storeAddress,
                        gstNumber: req.body.gstNumber,
                        phone: req.body.phone,
                        email: req.body.email,
                    },
                    { new: true, runValidators: true }
                );
            } else {
                // Create new store
                await Store.create({
                    owner: req.user.id,
                    storeName: req.body.storeName,
                    storeAddress: req.body.storeAddress,
                    gstNumber: req.body.gstNumber,
                    phone: req.body.phone,
                    email: req.body.email,
                });
            }
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!(await user.comparePassword(req.body.currentPassword))) {
            return res.status(401).json({
                success: false,
                message: 'Password is incorrect',
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            storeName: user.storeName,
            storeAddress: user.storeAddress,
            gstNumber: user.gstNumber,
            isProfileComplete: user.isProfileComplete,
        },
    });
};
