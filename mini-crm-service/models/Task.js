const mongoose = require('mongoose');
const { TASK_STATUSES } = require('../utils/constants');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: TASK_STATUSES, default: 'Pending' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Task', taskSchema);
