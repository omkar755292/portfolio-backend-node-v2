const express = require('express');
const validateToken = require('../middleware/validateToken');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const Admin = require('../models/Admin');

const router = express.Router();

// Public - Sign Up
router.route('/sign-up').post(
    asyncHandler(async (req, res) => {
        const { adminName, adminEmail, adminPassword } = req.body;

        if (!adminName || !adminEmail || !adminPassword) {
            res.status(400);
            throw new Error("All fields are mandatory");
        }

        const adminExist = await Admin.findOne({ adminEmail });
        if (adminExist) {
            res.status(409);
            throw new Error("Admin already exists");
        }

        const admin_id = uuidv4();
        const hashPassword = await bcrypt.hash(adminPassword, 10);
        const admin = new Admin({
            admin_id,
            adminName,
            adminEmail,
            adminPassword: hashPassword
        });

        await admin.save();
        res.status(201).json({ message: "Admin created successfully" });
    })
);

// Public - Login
router.route('/login').post(
    asyncHandler(async (req, res) => {
        const { adminEmail, adminPassword } = req.body;
        
        if (!adminEmail || !adminPassword) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }
        
        const admin = await Admin.findOne({ adminEmail });
        if (!admin) {
            return res.status(404).json({ message: "Admin does not exist" });
        }
        
        const passwordMatch = await bcrypt.compare(adminPassword, admin.adminPassword);
        if (passwordMatch) {
            const token = jwt.sign(
                {
                    admin: {
                        adminName: admin.adminName,
                        adminEmail: admin.adminEmail,
                        admin_id: admin.admin_id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "150m" }
            );
            
            res.status(200).json({
                status: 1,
                message: "Login successful",
                token,
                adminName: admin.adminName,
                adminEmail: admin.adminEmail,
                admin_id: admin.admin_id
            });
        } else {
            res.status(401);
            throw new Error("Invalid password or email");
        }
    })
);

// Private - Current User
router.route('/current-user').post(
    validateToken,
    asyncHandler(async (req, res) => {
        res.status(200).json(req.user);
    })
);

const authRouter = router;

module.exports = authRouter;
