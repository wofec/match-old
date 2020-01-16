//prepare data block
const gameElements = {
  modal: document.querySelector('#modal'),
  disabled: document.querySelector("#disabled"),
  newGameButton: document.querySelector("#new-game-button"),
  acceptButton: document.querySelector("#accept-button"),
  closeButton: document.querySelector("#close-button"),
  loginWrapper: document.querySelector("#login-wrapper"),
  nameInput: document.querySelector("#login"),
  modalHeader: document.querySelector("#modal-header"),
  modalContent: document.querySelector("#modal-content"),
  gameBoard: document.querySelector("#game-board"),
  gameRules: document.querySelector("#rules"),
}

const GAME_STATE_PREPARE = 'GAME_STATE_PREPARE';
const GAME_STATE_LOGIN = 'GAME_STATE_LOGIN';
const GAME_STATE_NONE = 'GAME_STATE_NONE';
const GAME_STATE_CHOOSE_CARD_SHIRT = 'GAME_STATE_CHOOSE_CARD_SHIRT';
const GAME_STATE_CHOOSE_DIFFICULT = 'GAME_STATE_CHOOSE_DIFFICULT';

const cardShirts = ['card-shirt1', 'card-shirt2', 'card-shirt3'];
const cardsBack = ['cardback1', 'cardback2', 'cardback3'];
const cardsQuantity = [9, 18, 30];

const headerMessages = {
  loginStage: 'Введите ваше имя',
  cardShirtStage: 'Выберите рубашку карточек',
  cardsQuantityStage: 'Выберите количество карточек',
}

const gameData = {
  player: {
    name: localStorage.getItem('mmg_player'),
  },
  gameState: GAME_STATE_NONE,
  cardShirt: null,
  cardsQuantity: null,
  cardBackArr: [],
}

// init block
gameElements.newGameButton.addEventListener("click", actionController);
gameElements.acceptButton.addEventListener("click", actionController);
gameElements.closeButton.addEventListener("click", hideModal);

function checkPlayer() {
  if (gameData.player.name) {
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
  gameData.gameState = GAME_STATE_NONE;
  gameElements.modalContent.innerHTML = '';
}

function actionController({target}) {
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
      checkCardValue();
      break;
    }

    default:
      break;
  } 
}

function regNewPlayer() {
  gameElements.loginWrapper.style.display = 'flex';
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
  chooseCardShirt();
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
    gameElements.modalContent.appendChild(generateCard({quantity: item, id: index}));
  });
}

function prepareGameStuff({dataset}) { 
  gameData.gameState = GAME_STATE_CHOOSE_DIFFICULT;
  gameData.cardsQuantity = cardsQuantity[dataset.id];
  gameElements.gameRules.style.display = 'none';
  gameElements.gameBoard.style.display = 'flex';
  hideModal();
  generateArrayOfCardsBack();
  //init gameCtrl
  // gameData.getInfo = gameController();
  renderContent();
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
}

function generateCard(options) {
  const template = `<div class="card ${options.extraClass}" data-id="${options.id}">${options.quantity}</div>`;
  const card = document.createElement('div');
  card.innerHTML = template;
  card.addEventListener('click', actionController);
  return card;
}

function generateUniqId() {
  return `mmg${(Math.floor(Math.random()*1e8)).toString(16)}`;
}

function gameController() {
  const cardsInfo = {};
  const comparedObjects = {};

  function getInfo(id) {
    cardsInfo[id] || generateInfo(id);
    return cardsInfo[id];
  }

  function generateInfo(id) {
    cardsInfo[id] = gameData.cardBackArr.splice(Math.floor(Math.random() * gameData.cardBackArr.length));
  }

  function compareIt() {

  }

  return getInfo;
}

function generateArrayOfCardsBack() {
  cardsBack.forEach((item) => {
    const arr = new Array(gameData.cardsQuantity / cardsBack.length);
    arr.fill(item)
    gameData.cardBackArr = gameData.cardBackArr.concat(arr);
  });
}