const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['success', 'failure'], required: true },
    paymentDate: { type: Date, default: Date.now },
    stripeSessionId: { type: String, required: true },
});

module.exports = mongoose.model('Payment', PaymentSchema);
