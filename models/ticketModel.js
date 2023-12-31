const mongoose = require('mongoose');
const dateToNumberStyleDate = require('../utils/dateToNumberStyleDate');

const ticketSchema = (dictionary) =>
  new mongoose.Schema({
    userGDProfile: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [
        true,
        'Ticket must belong to a user Game Data Profile',
      ],
    },
    dicEntry: {
      type: mongoose.Schema.ObjectId,
      ref: dictionary,
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

const ticketSchemaPersonal = ticketSchema(
  'DicEntryPersonal',
);
exports.TicketPersonal = mongoose.model(
  'TicketPersonal',
  ticketSchemaPersonal,
  'Tickets (Personal)',
);

const ticketSchemaBrazil = ticketSchema('DicEntryBrazil');
exports.TicketBrazil = mongoose.model(
  'TicketBrazil',
  ticketSchemaBrazil,
  'Tickets (Brazil)',
);

const ticketSchemaPortBeg = ticketSchema('DicEntryPortBeg');
exports.TicketPortBeg = mongoose.model(
  'TicketPortBeg',
  ticketSchemaPortBeg,
  'Tickets (PortBeg)',
);
