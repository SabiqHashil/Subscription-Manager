const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const subscriptionSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
        unique: true
    },
    client_name: {
        type: String,
        required: true
    },
    business_name: {
        type: String,
        required: true
    },
    client_email: String,
    client_phone: String,
    price: {
        type: Number,
        required: true
    },
    paid_date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    renewal_date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    notes: String,
    status: {
        type: String,
        default: "Active"
    },
    created_by: {
        type: String, // User ID
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

subscriptionSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj._id;
    return obj;
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
