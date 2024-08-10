const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    admin_id: { type: String, required: true },
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true, trim: true },
    adminPassword: { type: String, required: true, trim: true }
}, { timestamps: true });

const Admin = mongoose.model('Admin', schema);

module.exports = Admin;
