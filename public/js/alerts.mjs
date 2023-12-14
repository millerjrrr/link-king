export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};
// type is 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document
    .querySelector('body')
    .insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 3000);
};

export const hidePop = () => {
  const el = document.querySelector('.pop');
  if (el) el.parentElement.removeChild(el);
};

//type is correct or incorrect
export const showPop = (type, level) => {
  hidePop();
  let pop = document.createElement('div');
  pop.setAttribute('class', `pop pop_${type}`);
  if (level !== 'R') pop.innerHTML = 'L' + level;
  else pop.innerHTML = 'R';
  document.getElementById('formx').appendChild(pop);
  const timeOut = 1000;
  let i = 1;

  const dimEl = () => {
    pop.setAttribute(
      'style',
      `opacity:${(103 - i) / 103}; transform: translate(${
        i / 5
      }px,${-i / 2}px)`,
    );
    i += 1;
  };
  const interval = setInterval(dimEl, timeOut / 100);
  const clearAll = () => {
    clearTimeout(interval);
    hidePop();
  };

  const changeLevelNumber = () => {
    if (level !== 'R')
      pop.innerHTML = 'L' + (level * 1 + 1);
  };
  window.setTimeout(clearAll, timeOut / 2);
  window.setTimeout(clearAll, timeOut);
};
