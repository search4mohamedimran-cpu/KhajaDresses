const mongoose = require('mongoose');

const UniformSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
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
    sizes: [{
        type: String
    }],
    sizePrices: {
        type: Map,
        of: Number
    },
    school: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 100
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Uniform', UniformSchema);
