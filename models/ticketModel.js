const mongoose = require('mongoose');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Ticket must belong to a user'],
  },
  dicEntry: {
    type: mongoose.Schema.ObjectId,
    ref: 'DicEntry',
    required: [
      true,
      'Ticket must be associated with a dictionary entry',
    ],
  },
  level: {
    type: Number,
    default: 1,
  },
  dueDate: {
    type: Number,
    default: dateToNumberStyleDate(Date.now()) + 1,
  },
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
