const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true, // "admin" or "staff"
        default: "staff"
    },
    access_level: {
        type: String,
        enum: ["full", "view_only"],
        default: "full"
    },
    permissions: {
        subscriptions_view: { type: Boolean, default: true },
        subscriptions_create: { type: Boolean, default: false },
        subscriptions_edit: { type: Boolean, default: false },
        subscriptions_delete: { type: Boolean, default: false },
        staff_manage: { type: Boolean, default: false }
    },
    password_hash: {
        type: String,
        required: true
    },
    created_at: {
        type: String,
        default: () => new Date().toISOString()
    },
    updated_at: {
        type: String,
        default: () => new Date().toISOString()
    }
}, {
    timestamps: false,
    versionKey: false,
    id: false
});

// Hide _id and password_hash in toJSON
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj._id;
    delete obj.password_hash;
    return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
