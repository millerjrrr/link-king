// import axios from 'axios';
import { login, logout, signup } from './login.mjs';
import {
  elt,
  answerAccepted,
} from './consoleFunctions.mjs';
import { showAlert } from './alerts.mjs';
import { searchAndUpdate } from './dictionary.mjs';

////////////////////////////////////////////////////////////////////
// Console elements
const raceTrack = [],
  tail = [];
for (i = 0; i < 10; ++i)
  raceTrack.push(document.getElementById(`rc${i}`));
for (i = 0; i < 4; ++i)
  tail.push(document.getElementById(`te${i}`));

let form = document.getElementById('attempt'),
  due = document.getElementById('due'),
  steps = document.getElementById('steps'),
  timeplaying = document.getElementById('timeplaying'),
  formColor,
  responseTimer, //countdown timer for how long left to respond
  intervalTimer, //time management
  sessionTimer,
  time = 0, //time management
  timeplayingval, //time management
  timeUp = 10, //time management
  solutions,
  tries,
  rect,
  pointR,
  a,
  b,
  radius,
  perimeter;
// settings variables

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

let border = document.getElementById('border');
let rel, angle;

//////////////////////////////////////////////////////////
// CONSOLE FUNCTIONS
const startTheFormTimer = (timer = 10) => {
  clearTimeout(responseTimer);
  showBorder();
  hideTheBorderInSeconds(2, timer - 2);
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
    time += step; // time management
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
    startTheFormTimer(timeUp);
  } else {
    wrongWiggle();
    showBorder();
    clearInterval(intervalTimer);
    clearTimeout(responseTimer);
    sendResultAndUpdate(false);
    clearInterval(sessionTimer);
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
  if (soundControl.src.match(`/img/soundOn.png`)) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    speechSynthesis.speak(utterance);
  }
}

const sendResultAndUpdate = async (correct) => {
  try {
    const res = await axios.post(
      '/api/v1/gameData/submitAttempt',
      { correct, time },
    );
    time = 0;
    if (res.data.status === 'success') {
      updateRaceTrackAndStats(res.data);
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
      updateRaceTrackAndStats(res.data);
      solutions = res.data.data.attempt.solutions;
      tries = res.data.data.tries;
      updateColor();
    }
  } catch (err) {
    console.log(err);
    // showAlert('error', err.response.msg);
  }
};

const updateRaceTrackAndStats = (res) => {
  for (i = 0; i < 9; ++i)
    raceTrack[i + 1].innerText = res.data.raceTrack[i];
  raceTrack[0].innerText = res.data.attempt.target;
  for (i = 0; i < 4; ++i)
    tail[i].innerText = res.data.tail[i] || '';
  //updatestats
  due.innerText = res.data.stats.due;
  steps.innerText = res.data.stats.steps;
  timeplaying.innerText = `${Math.floor(
    res.data.stats.time / (1000 * 60),
  )}:${(
    Math.floor(res.data.stats.time / 1000) -
    60 * Math.floor(res.data.stats.time / (1000 * 60))
  )
    .toString()
    .padStart(2, '0')}`;
  timeplayingval = res.data.stats.time;
  // update timeUp
  if (res.data.timer) timeUp = 10;
  else timeUp = 20;
  //update settings block
  if (res.data.blurred)
    document.getElementById('racetrack').style =
      'visibility:hidden';
  // raceTrack[0].style = 'color: #1b1b1b; font-size: 50px;';
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
        startTheFormTimer(timeUp);
        clearInterval(sessionTimer);
        sessionTimer = setInterval(
          updateSessionTimerDisplay,
          1000,
        );
        form.value = '';
        speakText();

        // If the answer is wrong
      } else {
        wrongAnswerReturned();
        speakText();
      }
    }
  });

// d) time manangement

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function convertMsToTime(milliseconds) {
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
}

function updateSessionTimerDisplay() {
  timeplayingval += 1000;
  document.getElementById('timeplaying').innerText =
    convertMsToTime(timeplayingval);
}

// c) settings management
const soundControl = document.getElementById('sound');
const blurredControl = document.getElementById('blurred');
const soundControlBox = document.getElementById('soundBox');
const blurredControlBox =
  document.getElementById('blurredBox');
const timerControl = document.getElementById('timer1020');
const timerControlBox =
  document.getElementById('timer1020Box');

const soundStatus = async (onORoff) => {
  sound = onORoff === 'On';
  soundControl.src = `/img/sound${onORoff}.png`;
  await axios.post('/api/v1/gameData/updateGameSettings', {
    sound,
  });
};

const blurredStatus = async (onORoff) => {
  blurred = onORoff === 'On';
  blurredControl.src = `/img/blurred${onORoff}.png`;
  await axios.post('/api/v1/gameData/updateGameSettings', {
    blurred,
  });
};

if (soundControl)
  soundControlBox.addEventListener('click', async (e) => {
    if (soundControl.src.match(`/img/soundOff.png`)) {
      soundStatus('On');
    } else {
      soundStatus('Off');
      blurredStatus('Off');
      document.getElementById('racetrack').style =
        'visibility:visible';
    }
  });

if (blurredControl)
  blurredControlBox.addEventListener('click', async (e) => {
    if (blurredControl.src.match(`/img/blurredOff.png`)) {
      blurredStatus('On');
      soundStatus('On');
      // raceTrack[0].style =
      //   'color: #1b1b1b; font-size: 50px;';
      document.getElementById('racetrack').style =
        'visibility:hidden';
    } else {
      blurredStatus('Off');
      // raceTrack[0].style = 'color: white; font-size: 50px;';
      document.getElementById('racetrack').style =
        'visibility:visible';
    }
  });

// if (timerControl)
//   timerControlBox.addEventListener('click', async (e) => {
//     if (timerControl.innerText === '10s') {
//       timerControl.innerText === '20s';
//       timeUp = 20;
//       await axios.post(
//         '/api/v1/gameData/updateGameSettings',
//         {
//           timer: 20,
//         },
//       );
//     } else {
//       timerControl.innerText === '10s';
//       timeUp = 10;
//       await axios.post(
//         '/api/v1/gameData/updateGameSettings',
//         {
//           timer: 10,
//         },
//       );
//     }
//   });

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

///////////////////////////////////////////////////////////////////
///// DICTIONARY SEARCH ELEMENTS

const searchform = document.getElementById(
  'searchdictionary',
);

const searchAndUpdateValue = () =>
  searchAndUpdate(searchform.value);

if (searchform) {
  searchAndUpdateValue();
  searchform.addEventListener('keydown', async (e) => {
    clearTimeout(responseTimer);
    responseTimer = setTimeout(searchAndUpdateValue, 500);
  });
}
