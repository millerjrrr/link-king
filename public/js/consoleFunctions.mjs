export const answerAccepted = (solutions, answer) => {
  function normalize(inputString) {
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
      .replace(
        /[áéíóúàèìòùâêîôûãõñç]/gi,
        function (matched) {
          return accentsMap[matched];
        },
      )
      .replace(
        /['"!@#$%¨&*\[\]\(\)_\-`´\{\}^~<,>.:;?/\+\-\=]/g,
        '',
      );
  }

  const normalized = solutions.map((sol) => normalize(sol));
  return normalized.includes(normalize(answer));
};
