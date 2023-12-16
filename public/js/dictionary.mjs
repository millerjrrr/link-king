// const axios = require('axios');
import { elt, normalize } from './consoleFunctions.mjs';
import { showAlert, showDicAlert } from './alerts.mjs';

export const searchAndUpdate = async (pattern) => {
  const normpattern = normalize(pattern);

  try {
    const res = await axios.get(
      `/api/v1/dictionary?pattern=^${normpattern}`,
    );
    const table = document.getElementById(
      'dictionarytable',
    );
    table.removeChild(table.firstChild);
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    let i = 0,
      row;
    for (let result of res.data.data.dicEntries) {
      row = elt(
        'tr',
        { id: `row${i}`, class: 'nav_el', style: '' },
        elt(
          'td',
          {
            id: `target${i}`,
            class: 'leftcolumn',
            translate: 'no',
          },
          document.createTextNode(result.target),
        ),
        elt(
          'td',
          {
            class: 'rightcolumn',
            translate: 'no',
          },
          document.createTextNode(
            result.solutions
              .toString()
              .split(',')
              .join(' // '),
          ),
        ),
        elt(
          'td',
          {
            class: 'addfield',
          },
          document.createTextNode('+'),
        ),
      );
      tbody.appendChild(row);
      row.addEventListener('mouseover', (e) => {
        visible();
      });
      row.addEventListener('mouseleave', (e) => {
        hidden();
      });
      row.addEventListener('click', (e) => {
        addWordToQueue(e);
      });
      i += 1;
    }
  } catch (err) {
    showAlert('error', 'Somethings not right');
  }
};

const hidden = () => {
  document
    .getElementById('dictionarynotification')
    .setAttribute('style', 'visibility: hidden');
};

const visible = () => {
  document
    .getElementById('dictionarynotification')
    .setAttribute('style', 'visibility: visible');
};

const addWordToQueue = async (e) => {
  const target = e.target.parentNode.firstChild.innerText;
  const res = await axios.post('/api/v1/tickets', {
    target,
  });

  if (res.data.status === 'success') {
    showDicAlert(
      'success',
      'This word has been added to your queue',
    );
  } else {
    showDicAlert(
      'error',
      'This word is already in your queue',
    );
  }
};
