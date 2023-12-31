const {
  DicEntryPersonal,
  DicEntryBrazil,
  DicEntryPortBeg,
} = require('../models/dicEntryModel');
const {
  TicketPersonal,
  TicketBrazil,
  TicketPortBeg,
} = require('../models/ticketModel');

exports.selectorDicEntry = (dictionary) => {
  if (dictionary === 'Personal') return DicEntryPersonal;
  else if (dictionary === 'Brazil') return DicEntryBrazil;
  else if (dictionary === 'PortBeg') return DicEntryPortBeg;
};

exports.selectorTicket = (dictionary) => {
  if (dictionary === 'Personal') return TicketPersonal;
  else if (dictionary === 'Brazil') return TicketBrazil;
  else if (dictionary === 'PortBeg') return TicketPortBeg;
};
