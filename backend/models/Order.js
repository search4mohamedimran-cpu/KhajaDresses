const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        }
    },
    items: [{
        id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        school: {
            type: String,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'COD'
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
