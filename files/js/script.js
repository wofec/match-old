//prepare data block
const gameElements = {
  modal: document.querySelector('#modal'),
  disabled: document.querySelector("#disabled"),
  newGameButton: document.querySelector("#new-game-button"),
  reloadButton: document.querySelector("#reload-button"),
  acceptButton: document.querySelector("#accept-button"),
  closeButton: document.querySelector("#close-button"),
  recordsButton: document.querySelector("#records-button"),
  loginWrapper: document.querySelector("#login-wrapper"),
  nameInput: document.querySelector("#login"),
  modalHeader: document.querySelector("#modal-header"),
  modalContent: document.querySelector("#modal-content"),
  gameBoard: document.querySelector("#game-board"),
  gameRules: document.querySelector("#rules"),
  playerName: document.querySelector("#player-name"),
  playerScore: document.querySelector("#player-score"),
  recordsTableContent: document.querySelector("#records-table-content"),
  recordsTable: document.querySelector("#records-table"),
  closeRecordsButton: document.querySelector("#close-records-button"),
  logOutButton: document.querySelector("#log-out"),
}

const GAME_STATE_LOGIN = 'GAME_STATE_LOGIN';
const GAME_STATE_NONE = 'GAME_STATE_NONE';
const GAME_STATE_CHOOSE_CARD_SHIRT = 'GAME_STATE_CHOOSE_CARD_SHIRT';
const GAME_STATE_CHOOSE_DIFFICULT = 'GAME_STATE_CHOOSE_DIFFICULT';
const GAME_STATE_IN_PROGRESS = 'GAME_STATE_IN_PROGRESS';
const GAME_STATE_FINISH = 'GAME_STATE_FINISH';

const cardShirts = ['card-shirt1', 'card-shirt2', 'card-shirt3'];
const cardsBack = ['cardback1', 'cardback2', 'cardback3'];
const cardsQuantity = [6, 18, 30];

const headerMessages = {
  loginStage: 'Введите ваше имя',
  cardShirtStage: 'Выберите рубашку карточек',
  cardsQuantityStage: 'Выберите количество карточек',
  reloadMessage: 'Вы уверены что хотите начать новую игру ? Весь прогресс будет потерян',
  winMessage: 'Вы победили!!! Хотите начать новую игру ?',
  logoutMessage: 'Вы уверены что хотите сменить имя ? Весь прогресс будет потерян',
}

const gameData = {
  player: {
    name: localStorage.getItem('mmg_player'),
  },
  gameState: GAME_STATE_NONE,
  cardShirt: null,
  cardsQuantity: null,
  cardBackArr: [],
  controller: null,
  gameScore: 0,
  updateScore: null,
  renderRecords: true,
}

// init block
gameElements.newGameButton.addEventListener("click", actionController);
gameElements.acceptButton.addEventListener("click", actionController);
gameElements.closeButton.addEventListener("click", hideModal);
gameElements.recordsButton.addEventListener("click", openRecords);
gameElements.closeRecordsButton.addEventListener("click", closeRecords);
gameElements.reloadButton.addEventListener("click", reloadGame);
gameElements.logOutButton.addEventListener("click", showLogOutModal);

function checkPlayer() {
  if (gameData.player.name) {
    activateUserBar();
    chooseCardShirt();
  } else {
    gameData.gameState = GAME_STATE_LOGIN;
    regNewPlayer();
  }
  showModal();
}

function showModal() {
  disabled.style.display = "block";
  modal.style.display = "flex";
}

function hideModal() {
  disabled.style.display = "none";
  modal.style.display = "none";
  gameElements.modalContent.innerHTML = '';
  if (gameData.gameState !== GAME_STATE_IN_PROGRESS) {
    gameData.gameState = GAME_STATE_NONE;
  }
}
//управление кнопками в зависимости от состояния приложухи запускает нужный скрипт
function actionController({target}) {
  //пара костылей для перезапуска и смены юзера
  if (target.id === 'new-game-button' && gameData.gameState === GAME_STATE_IN_PROGRESS) {
    showReloadModal();
    return;
  } else if (gameData.logOut) {
    gameData.logOut = false;
    gameData.player = {};
    //
    reloadGame();
  }
  //
  switch(gameData.gameState){
    case GAME_STATE_NONE: {
      checkPlayer();
      break;
    }

    case GAME_STATE_LOGIN: {
      loginUser();
      break;
    }

    case GAME_STATE_CHOOSE_CARD_SHIRT: {
      chooseDifficult(target);
      break;
    }

    case GAME_STATE_CHOOSE_DIFFICULT: {
      prepareGameStuff(target);
      break;
    }

    case GAME_STATE_IN_PROGRESS: {
      gameData.controller(target);
      break;
    }

    default:
      break;
  } 
}

function regNewPlayer() {
  gameElements.loginWrapper.style.display = 'block';
  gameElements.acceptButton.style.display = 'flex';
  gameElements.modalHeader.innerHTML = headerMessages.loginStage;
}

function loginUser() {
  const name = gameElements.nameInput.value;

  if (!name.length) {
    return;
  }
  localStorage.setItem('mmg_player', name);
  gameData.player.name = name;
  activateUserBar();
  chooseCardShirt();
}

function activateUserBar() {
  gameElements.playerName.style.display = 'flex';
  gameElements.playerName.innerHTML = gameData.player.name;
  gameElements.playerScore.style.display = 'flex';
  gameElements.playerScore.innerHTML = 'Score: 0';
  gameElements.logOutButton.style.display = 'flex';
}

function chooseCardShirt() {
  gameData.gameState = GAME_STATE_CHOOSE_CARD_SHIRT;

  gameElements.loginWrapper.style.display = 'none';
  gameElements.acceptButton.style.display = 'none';
  gameElements.modalHeader.innerHTML = headerMessages.cardShirtStage;

  cardShirts.forEach((item, index) => 
    gameElements.modalContent.appendChild(
      generateCard({
        extraClass: item, 
        id: index,
      })
  ));
}

function chooseDifficult({dataset}) {
  gameData.cardShirt = cardShirts[dataset.id];
  gameData.gameState = GAME_STATE_CHOOSE_DIFFICULT;

  gameElements.modalHeader.innerHTML = headerMessages.cardsQuantityStage;
  gameElements.modalContent.innerHTML = '';

  cardsQuantity.forEach((item, index) => {
    gameElements.modalContent.appendChild(
      generateCard({
        quantity: item, 
        id: index, 
        extraClass: 'quantity',
      }));
  });
}

function prepareGameStuff({dataset}) { 
  hideModal();
  gameData.gameState = GAME_STATE_IN_PROGRESS;
  gameData.cardsQuantity = cardsQuantity[dataset.id];
  gameElements.gameRules.style.display = 'none';
  gameElements.gameBoard.style.display = 'flex';
  generateArrayOfCardsBack();
  renderContent();
  gameData.controller = gameController();
  gameData.updateScore = computeScore();
}

function renderContent() {
  gameData.cardBackArr.forEach(() => {
    gameElements.gameBoard.appendChild(
      generateCard({
        extraClass: gameData.cardShirt, 
        id: generateUniqId(),
      })
    );
  });
  
  activateUserBar();
}

function generateCard(options) {
  const template = `<div class="card ${options.extraClass}" data-id="${options.id}">${options.quantity || ''}</div>`;
  const card = document.createElement('div');
  card.innerHTML = template;
  card.classList.add('card-wrapper');
  card.addEventListener('click', actionController);
  return card;
}

function generateUniqId() {
  return `mmg${(Math.floor(Math.random()*1e8)).toString(16)}`;
}

function gameController() {
  const cardsInfo = {};
  const comparedObjects = {
    first: null,
    second: null,
    needRefresh: false,
  };

  function checkCardValue(target) {
    const {isOpen} = target.dataset;

    if (isOpen === 'true') {
      return;
    } else if (comparedObjects.needRefresh) {
      refreshCards();
    }

    const {id} = target.dataset;
    const info = getInfo(id);

    target.classList.add(info);
    target.dataset.isOpen = true;

    if (!comparedObjects.first) {
      comparedObjects.first = target;
    } else {
      comparedObjects.second = target;
      compareIt();
    }
  }

  function getInfo(id) {
    cardsInfo[id] || generateInfo(id);
    return cardsInfo[id];
  }

  function generateInfo(id) {
    cardsInfo[id] = gameData.cardBackArr.splice(
      Math.floor(
        Math.random() * gameData.cardBackArr.length), 1)[0];
  }

  function compareIt() {
    const firstCardInfo = getInfo(comparedObjects.first.dataset.id);
    const secondCardInfo = getInfo(comparedObjects.second.dataset.id);

    if (firstCardInfo === secondCardInfo) {
      comparedObjects.first.removeEventListener('click', actionController);
      comparedObjects.second.removeEventListener('click', actionController);
      comparedObjects.first = null;
      comparedObjects.second = null;
      gameData.updateScore(true);
    } else {
      comparedObjects.needRefresh = true;
      gameData.updateScore();
    }

    if (!gameData.cardBackArr.length) {
      finishGame();
    }
  }

  function refreshCards() {
    const firstCardInfo = getInfo(comparedObjects.first.dataset.id);
    const secondCardInfo = getInfo(comparedObjects.second.dataset.id);
    comparedObjects.first.classList.remove(firstCardInfo);
    comparedObjects.first.dataset.isOpen = false;
    comparedObjects.second.classList.remove(secondCardInfo);
    comparedObjects.second.dataset.isOpen = false;
    comparedObjects.needRefresh = false;
    comparedObjects.first = null;
    comparedObjects.second = null;
    comparedObjects.needRefresh = false;
  }

  function finishGame() {
    gameData.gameState = GAME_STATE_FINISH;
    saveRecord();
    showReloadModal();
  }

  return checkCardValue;
}

function generateArrayOfCardsBack() {
  cardsBack.forEach((item) => {
    const arr = new Array(gameData.cardsQuantity / cardsBack.length);
    arr.fill(item)
    gameData.cardBackArr = gameData.cardBackArr.concat(arr);
  });
}

function computeScore() {
  const score = {
    defaultScore: 7,
    defaultLoseScore: 2,
    defaultMultiple: 1,
    multiple: 1,
  }

  function addPoints() {
    const points = gameData.gameScore + score.defaultScore * score.multiple;
    gameData.gameScore = points;
    score.multiple++;
    updateScore();
  }

  function removePoints() {
    let points = gameData.gameScore - score.defaultLoseScore;
    if (points < 0) {
      points = 0;
    }
    gameData.gameScore = points;
    score.multiple = score.defaultMultiple;
    updateScore();
  }

  function updateScore() {
    gameElements.playerScore.innerHTML = `Score: ${gameData.gameScore}`;
  }

  return function(add = false) {
    if (add) {
      addPoints();
    } else {
      removePoints();
    }
  }
}

function saveRecord() {
  let records = localStorage.getItem('mmg_records');
  const points = {
    name: gameData.player.name, 
    score: gameData.gameScore,
  }
  if (records) {
    records = JSON.parse(records);
    records.push(points);
    records = JSON.stringify(records);
    localStorage.setItem('mmg_records', records);
  } else {
    records = JSON.stringify([points]);
    localStorage.setItem('mmg_records', records);
  }
  gameData.renderRecords = true;
}

function openRecords() {
  gameElements.recordsTable.style.display = 'flex';
  gameElements.disabled.style.display = 'block';
  if (gameData.renderRecords) {
    gameData.renderRecords = false;
    renderRecords();
  };
}

function closeRecords() {
  gameElements.recordsTable.style.display = 'none';
  gameElements.disabled.style.display = 'none';
}

function renderRecords() {
  let records = localStorage.getItem('mmg_records');
  if (records) {
    records = JSON.parse(records);
    gameElements.recordsTableContent.innerHTML = '';
    records.forEach((item) => {
      const template = `<div>${item.name}</div><div>${item.score}</div>`;
      const elem = document.createElement('div');
      elem.innerHTML = template;
      elem.classList.add('record');
      gameElements.recordsTableContent.appendChild(elem);
    });
  } 
};

function showReloadModal() {
  disabled.style.display = "block";
  modal.style.display = "flex";
  if (gameData.gameState === GAME_STATE_FINISH) {
    gameElements.modalHeader.innerHTML = headerMessages.winMessage;
  } else {
    gameElements.modalHeader.innerHTML = headerMessages.reloadMessage;
  }
  gameElements.reloadButton.style.display = 'flex';
}

function showLogOutModal() {
  disabled.style.display = "block";
  modal.style.display = "flex";
  gameElements.modalHeader.innerHTML = headerMessages.logoutMessage;
  gameElements.acceptButton.style.display = 'flex';
  gameData.logOut = true;
}

function reloadGame() {
  gameData.gameState = GAME_STATE_NONE;
  gameData.cardShirt = null;
  gameData.cardsQuantity = null;
  gameData.cardBackArr = [];
  gameData.updateScore = null;
  gameData.renderRecords = true;
  gameElements.gameRules.style.display = 'block';
  gameElements.gameBoard.innerHTML = '';
  gameElements.gameBoard.style.display = 'none';
  gameElements.reloadButton.style.display = 'none';
  checkPlayer();
}

