const mongoose = require('mongoose');
const { LEAD_STATUSES } = require('../utils/constants');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    status: { type: String, enum: LEAD_STATUSES, default: 'New' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

leadSchema.index({ name: 'text', email: 'text' });

leadSchema.query.notDeleted = function notDeleted() {
  return this.where({ isDeleted: false });
};

module.exports = mongoose.model('Lead', leadSchema);
