// import axios from 'axios';
import { login, logout, signup } from './login.mjs';
import { answerAccepted } from './consoleFunctions.mjs';
import { showAlert } from './alerts.mjs';

////////////////////////////////////////////////////////////////////
// Console elements
const raceTrack = [],
  tail = [];
for (i = 0; i < 10; ++i)
  raceTrack.push(document.getElementById(`rc${i}`));
for (i = 0; i < 4; ++i)
  tail.push(document.getElementById(`te${i}`));

let form = document.getElementById('attempt'),
  formColor,
  responseTimer, //countdown timer for how long left to respond
  intervalTimer, //time management
  // let timePlaying; //time management
  solutions,
  tries,
  rect,
  pointR,
  a,
  b,
  radius,
  perimeter;

if (form) {
  form.style.borderRadius = '15px';
  // rect = form.getBoundingClientRect();
  rect = { left: 0, top: 0 };
  pointR = 2;
  a = form.clientWidth;
  b = form.clientHeight;
  radius = form.style.borderRadius.slice(0, -2) * 1;
  perimeter =
    b * 2 + a * 2 - radius * 8 + 2 * Math.PI * radius;
}

const elt = (name, attrs, ...children) => {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
};

let border = document.getElementById('border');
let rel, angle;

//////////////////////////////////////////////////////////
// CONSOLE FUNCTIONS
const startTheFormTimer = (timer = 10) => {
  clearTimeout(responseTimer);
  showBorder();
  hideTheBorderInSeconds();
  responseTimer = setTimeout(
    wrongAnswerReturned,
    timer * 1000,
  );
};

const showBorder = () => {
  for (let i = 1; i <= perimeter; ++i)
    document.getElementById(`point${i}`).style.visibility =
      'visible';
};

const hideTheBorderInSeconds = (delay = 2, timer = 8) => {
  clearInterval(intervalTimer);
  let j = 1,
    i = 1;
  const step = (timer * 1000) / perimeter;
  function hideBorderPointWithDelay() {
    const delayEnd = (delay * 1000) / step;
    if (j > delayEnd && i <= perimeter) {
      document.getElementById(
        `point${i}`,
      ).style.visibility = 'hidden';
      i = i + 1;
    }
    j = j + 1;
    // timePlaying += step;
  }
  intervalTimer = setInterval(
    hideBorderPointWithDelay,
    step,
  );
};

const wrongAnswerReturned = () => {
  if (tries > 1) {
    wrongWiggle();
    tries -= 1;
    updateColor();
    startTheFormTimer();
  } else {
    wrongWiggle();
    showBorder();
    clearInterval(intervalTimer);
    clearTimeout(responseTimer);
    sendResultAndUpdate(false);
    form.value = '';
  }
};

const updateBorderColor = () => {
  for (let i = 1; i <= perimeter; ++i)
    document.getElementById(
      `point${i}`,
    ).style.backgroundColor = formColor;
};

const updateColor = () => {
  if (tries == 2) formColor = 'hsl(32, 92%, 65%)';
  else if (tries == 1) formColor = 'hsl(0, 84%, 71%)';
  else formColor = 'hsl(0, 0%, 100%)';

  document
    .getElementById('attempt')
    .setAttribute('style', `color: ${formColor}`);
  updateBorderColor();
};

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  speechSynthesis.speak(utterance);
}

const sendResultAndUpdate = async (correct) => {
  try {
    const res = await axios.post(
      '/api/v1/gameData/submitAttempt',
      { correct },
    );

    if (res.data.status === 'success') {
      updateRaceTrack(res.data);
      solutions = res.data.data.attempt.solutions;
      tries = res.data.data.tries;
      updateColor();
      speakText(res.data.data.attempt.target);
    }
  } catch (err) {
    console.log(err);
    // showAlert('error', err.response.msg);
  }
};

function wrongWiggle() {
  let angle = Math.PI / 2;
  function animate(time, lastTime) {
    if (lastTime != null) {
      angle += (time - lastTime) * 0.1;
    }

    form.style.top = Math.sin(angle) * 5 + 'px';
    form.style.left = Math.cos(angle) * 5 + 'px';
    if (angle < 10 * Math.PI)
      requestAnimationFrame((newTime) =>
        animate(newTime, time),
      );
  }
  requestAnimationFrame(animate);
}

const updatePageValues = async () => {
  try {
    const res = await axios.post(
      '/api/v1/gameData/sendGameState',
    );

    if (res.data.status === 'success') {
      updateRaceTrack(res.data);
      solutions = res.data.data.attempt.solutions;
      tries = res.data.data.tries;
      updateColor();
    }
  } catch (err) {
    console.log(err);
    // showAlert('error', err.response.msg);
  }
};

const updateRaceTrack = (res) => {
  for (i = 0; i < 9; ++i)
    raceTrack[i + 1].innerText = res.data.raceTrack[i];
  raceTrack[0].innerText = res.data.attempt.target;
  for (i = 0; i < 4; ++i)
    tail[i].innerText = res.data.tail[i] || '';
};

function drawFormBorder() {
  //draw the border inside the forLoop
  for (i = 1; i <= perimeter; ++i) {
    if (i < a / 2 - radius) {
      border.appendChild(
        elt('div', {
          class: 'point',
          id: `point${i}`,
          style: `width:${pointR}px; height:${pointR}px;
    left:${rect.left + a / 2 + i - pointR / 2}px ; 
    top:${rect.top - pointR / 2}px;
    `,
        }),
      );
    } else if (
      i <
      a / 2 - radius + (Math.PI * radius) / 2
    ) {
      angle = Math.PI / 2 - (i - a / 2 + radius) / radius;
      border.appendChild(
        elt('div', {
          class: 'point',
          id: `point${i}`,
          style: `width:${pointR}px; height:${pointR}px;
      left:${
        rect.left +
        a -
        radius +
        radius * Math.cos(angle) -
        pointR / 2
      }px ; 
      top:${
        rect.top +
        radius -
        radius * Math.sin(angle) -
        pointR / 2
      }px;
      `,
        }),
      );
    } else if (
      i <
      a / 2 - 3 * radius + (Math.PI * radius) / 2 + b
    ) {
      border.appendChild(
        elt('div', {
          class: 'point',
          id: `point${i}`,
          style: `width:${pointR}px; height:${pointR}px;
      left:${rect.left + a - pointR / 2}px ; 
      top:${
        rect.top +
        radius +
        i -
        (a / 2 - radius + (Math.PI * radius) / 2) -
        pointR / 2
      }px;
      `,
        }),
      );
    } else if (
      i <
      a / 2 - 3 * radius + Math.PI * radius + b
    ) {
      border.appendChild(
        elt('div', {
          class: 'point',
          id: `point${i}`,
          style: `width:${pointR}px; height:${pointR}px;
      left:${
        rect.left +
        a -
        radius +
        radius *
          Math.cos(
            (i -
              (a / 2 -
                3 * radius +
                (Math.PI * radius) / 2 +
                b)) /
              radius,
          ) -
        pointR / 2
      }px ; 
      top:${
        rect.top +
        b -
        radius +
        radius *
          Math.sin(
            (i -
              (a / 2 -
                3 * radius +
                (Math.PI * radius) / 2 +
                b)) /
              radius,
          ) -
        pointR / 2
      }px;
      `,
        }),
      );
    } else if (
      i <
      (3 * a) / 2 - 5 * radius + Math.PI * radius + b
    ) {
      border.appendChild(
        elt('div', {
          class: 'point',
          id: `point${i}`,
          style: `width:${pointR}px; height:${pointR}px;
      left:${
        rect.left +
        a -
        radius -
        i +
        a / 2 -
        3 * radius +
        Math.PI * radius +
        b -
        pointR / 2
      }px ; 
      top:${rect.top + b - pointR / 2}px;
      `,
        }),
      );
    } else if (
      i <
      (3 * a) / 2 -
        5 * radius +
        (3 * Math.PI * radius) / 2 +
        b
    ) {
      rel =
        i -
        ((3 * a) / 2 - 5 * radius + Math.PI * radius + b); // rel is i -(section start)
      angle = Math.PI / 2 + rel / radius;
      border.appendChild(
        elt('div', {
          class: 'point',
          id: `point${i}`,
          style: `width:${pointR}px; height:${pointR}px;
      left:${
        rect.left +
        radius +
        radius * Math.cos(-angle) -
        pointR / 2
      }px ; 
      top:${
        rect.top +
        b -
        radius -
        radius * Math.sin(-angle) -
        pointR / 2
      }px;
      `,
        }),
      );
    } else if (
      i <
      (3 * a) / 2 -
        7 * radius +
        (3 * Math.PI * radius) / 2 +
        2 * b
    ) {
      rel =
        i -
        ((3 * a) / 2 -
          5 * radius +
          (3 * Math.PI * radius) / 2 +
          b); // rel is i -(section start)
      border.appendChild(
        elt('div', {
          class: 'point',
          id: `point${i}`,
          style: `width:${pointR}px; height:${pointR}px;
      left:${rect.left - pointR / 2}px ; 
      top:${rect.top + b - radius - rel - pointR / 2}px;
      `,
        }),
      );
    } else if (
      i <
      (3 * a) / 2 -
        7 * radius +
        2 * Math.PI * radius +
        2 * b
    ) {
      rel =
        i -
        ((3 * a) / 2 -
          7 * radius +
          (3 * Math.PI * radius) / 2 +
          2 * b); // rel is i -(section start)
      border.appendChild(
        elt('div', {
          class: 'point',
          id: `point${i}`,
          style: `width:${pointR}px; height:${pointR}px;
      left:${
        rect.left +
        radius -
        radius * Math.cos(rel / radius) -
        pointR / 2
      }px ; 
      top:${
        rect.top +
        radius -
        radius * Math.sin(rel / radius) -
        pointR / 2
      }px;
      `,
        }),
      );
    } else {
      rel =
        i -
        ((3 * a) / 2 -
          7 * radius +
          2 * Math.PI * radius +
          2 * b); // rel is i -(section start)
      border.appendChild(
        elt('div', {
          class: 'point',
          id: `point${i}`,
          style: `width:${pointR}px; height:${pointR}px;
      left:${rect.left + radius + rel - pointR / 2}px ; 
      top:${rect.top - pointR / 2}px;
      `,
        }),
      );
    }
  }
}

////////////////////////////////////////////////////////////////////
// Console Functionality
// 1) Loading the page and drawing the console

//  a) Draw the border
if (form) {
  drawFormBorder();

  //  b) Update page values
  updatePageValues();
}

//  c) Add the EnterKey functionality
if (form)
  form.addEventListener('keydown', async (e) => {
    if (e.key == 'Enter') {
      e.preventDefault();
      // If the answer is right
      if (answerAccepted(solutions, form.value)) {
        sendResultAndUpdate(true);
        startTheFormTimer();
        form.value = '';
        speakText();

        // If the answer is wrong
      } else {
        wrongAnswerReturned();
        speakText();
      }
    }
  });

////////////////////////////////////////////////////////////////////
// Login page elements
const loginForm = document.getElementById('loginform');
const signupForm = document.getElementById('signupform');
const logoutBtn = document.getElementById('logoutBtn');

//////////

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password =
      document.getElementById('password').value;
    login(email, password);
  });

if (signupForm)
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username =
      document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password =
      document.getElementById('password').value;
    const passwordConfirm = document.getElementById(
      'passwordConfirm',
    ).value;
    signup(username, email, password, passwordConfirm);
  });

if (logoutBtn)
  logoutBtn.addEventListener('click', (e) => {
    logout();
  });

// Form Timer Management

// function padTo2Digits(num) {
//   return num.toString().padStart(2, "0");
// }

// function convertMsToTime(milliseconds) {
//   let seconds = Math.floor(milliseconds / 1000);
//   let minutes = Math.floor(seconds / 60);
//   let hours = Math.floor(minutes / 60);

//   seconds = seconds % 60;
//   minutes = minutes % 60;
//   if (hours > 0)
//     return `${hours}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
//   else return `${minutes}:${padTo2Digits(seconds)}`;
// }

// let sessionTimer = setInterval(updateSessionTimerDisplay, 1000);

// function updateSessionTimerDisplay() {
//   sessionStats.Time = convertMsToTime(timePlaying);
//   document.getElementById("sessionStats-Time-value").innerText =
//     sessionStats.Time;
// }

// function timeToMS(timeIn) {
//   if (timeIn == 0) return 0;
//   let arr = timeIn.split(":");
//   if (arr.length == 3)
//     return (
//       arr[0] * 60 * 60 * 1000 +
//       Number(arr[1]) * 60 * 1000 +
//       Number(arr[2]) * 1000
//     );
//   else return arr[0] * 60 * 1000 + Number(arr[1]) * 1000;
// }

//set colours of points using strikes and .class color
