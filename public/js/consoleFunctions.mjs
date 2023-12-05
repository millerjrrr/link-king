export const normalize = (inputString) => {
  const accentsMap = {
    á: 'a',
    é: 'e',
    í: 'i',
    ó: 'o',
    ú: 'u',
    à: 'a',
    è: 'e',
    ì: 'i',
    ò: 'o',
    ù: 'u',
    â: 'a',
    ê: 'e',
    î: 'i',
    ô: 'o',
    û: 'u',
    ã: 'a',
    õ: 'o',
    ñ: 'n',
    ç: 'c',
  };

  inputString = inputString.toLowerCase();

  return inputString
    .replace(/[áéíóúàèìòùâêîôûãõñç]/gi, function (matched) {
      return accentsMap[matched];
    })
    .replace(
      /['"!@#$%¨&*\[\]\(\)_\-`´\{\}^~<,>.:;?/\+\-\=]/g,
      '',
    );
};

export const normAndRemoveSpace = (inputString) => {
  return normalize(inputString).replace(/ /g, '');
};

export const answerAccepted = (solutions, answer) => {
  const normalized = solutions.map((sol) =>
    normAndRemoveSpace(sol),
  );
  return normalized.includes(normAndRemoveSpace(answer));
};

export const elt = (name, attrs, ...children) => {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
};

////////////////////////////////////////
/////// Time Management

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export const convertMsToTime = (milliseconds) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;
  if (hours > 0)
    return `${hours}:${padTo2Digits(
      minutes,
    )}:${padTo2Digits(seconds)}`;
  else return `${minutes}:${padTo2Digits(seconds)}`;
};
