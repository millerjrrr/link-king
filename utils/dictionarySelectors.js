const {
  DicEntryPersonal,
  DicEntryBrazil,
} = require('../models/dicEntryModel');
const {
  TicketPersonal,
  TicketBrazil,
} = require('../models/ticketModel');

exports.selectorDicEntry = (dictionary) => {
  if (dictionary === 'Personal') return DicEntryPersonal;
  else if (dictionary === 'Brazil') return DicEntryBrazil;
};

exports.selectorTicket = (dictionary) => {
  if (dictionary === 'Personal') return TicketPersonal;
  else if (dictionary === 'Brazil') return TicketBrazil;
};
