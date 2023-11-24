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

export const answerAccepted = (solutions, answer) => {
  const normalized = solutions.map((sol) => normalize(sol));
  return normalized.includes(normalize(answer));
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
