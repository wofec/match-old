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
}

const GAME_STATE_PREPARE = 'GAME_STATE_PREPARE';
const GAME_STATE_LOGIN = 'GAME_STATE_LOGIN';
const GAME_STATE_NONE = 'GAME_STATE_NONE';
const GAME_STATE_CHOOSE_CARD_SHIRT = 'GAME_STATE_CHOOSE_CARD_SHIRT';
const GAME_STATE_CHOOSE_DIFFICULT = 'GAME_STATE_CHOOSE_DIFFICULT';

const cardShirts = ['card-shirt1', 'card-shirt2', 'card-shirt3'];
const cardsQuantity = [10, 20, 30];

const headerMessages = {
  loginStage: 'Введите ваше имя',
  cardShirtStage: 'Выберите рубашку карточек',
  cardsQuantityStage: 'Выберите количество карточек',
}

const gameData = {
  gameIsActive: false,
  player: {
    name: localStorage.getItem('mmg_player'),
  },
  gameState: GAME_STATE_NONE,
  cardShirt: null,
  cardsQuantity: null,
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
      renderContent(target);
      break;
    }

    case GAME_STATE_IN_PROGRESS: {
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

function renderContent({dataset}) {
  hideModal();
  gameData.cardsQuantity = cardsQuantity[dataset.id];
  gameData.gameState = GAME_STATE_CHOOSE_DIFFICULT;
}

function generateCard(options) {
  const template = `<div class="card ${options.extraClass}" data-id="${options.id}">${options.quantity}</div>`;
  const card = document.createElement('div');
  card.innerHTML = template;
  card.addEventListener('click', actionController);
  return card;
}

function generateUniqId() {
  return `mmg${(~~(Math.random()*1e8)).toString(16)}`;
}
// var scoreTable = [];

// function createChoseCardShirt() {
//     document.querySelector(".rules").style.display = "flex";
//     document.querySelector(".rules").style.justifyContent = "space-between";
//     document.querySelector(".rules").style.flexWrap = "wrap";

//     var elem = document.createElement('A');
//     document.querySelector('.rules').appendChild(elem);
//     elem.classList.add('card', 'card-shirt1');
//     elem.setAttribute('data-select', 'yes');

//     var elem = document.createElement('A');
//     document.querySelector('.rules').appendChild(elem);
//     elem.classList.add('card', 'card-shirt2');
//     elem.setAttribute('data-select', 'no');

//     var elem = document.createElement('A');
//     document.querySelector('.rules').appendChild(elem);
//     elem.classList.add('card', 'card-shirt3');
//     elem.setAttribute('data-select', 'no');

//     var elem = document.createElement('DIV');
//     document.querySelector('.rules').appendChild(elem);
//     elem.classList.add('option-text');
//     elem.innerHTML = "Choose style shirt for your cards";

//     var elem = document.createElement('A');
//     document.querySelector('.rules').appendChild(elem);
//     elem.classList.add('menu-btn', 'accept-btn');
//     document.querySelector(".accept-btn").innerHTML = "ACCEPT";
//     document.querySelector(".accept-btn").style.alignSelf = "flex-end";
// }

// var selectedCardShirt = 'card card-shirt1';
// var selectedQuantity = 'quantity quantity1';

// // function chooseCardShirt() {											//select the shirt of cards
// //     document.querySelector("[data-select = 'yes']").dataset.select = "no";
// //     event.target.dataset.select = "yes";
// //     selectedCardShirt = document.querySelector("[data-select = 'yes']").className;
// //     console.log(selectedCardShirt);
// // }

// function chooseQuantity() {												//select the number of cards
//     document.querySelector("[data-quant = 'yes']").dataset.quant = "no";
//     event.target.dataset.quant = "yes";
//     selectedQuantity = document.querySelector("[data-quant = 'yes']").className;
// }

// var acceptNumber = 1;

// function acceptButton() {
//     if (acceptNumber == 1) {
//         for (var i = 3; i > 0; i--) {
//             document.querySelector(".card").remove(".card");
//         }
//         createCardsQuantity();
//         acceptNumber++;
//     } else {
//         createGameStuff();
//     }
// }

// function createCardQuantity() {											//pick complexity
//     document.querySelector(".option-text").innerHTML = "Choose quantity of cards";

//     var elem = document.createElement('A');
//     document.querySelector('.rules').insertBefore(elem, document.querySelector(".option-text"));
//     elem.classList.add('quantity', "quantity3");
//     elem.setAttribute('data-quant', 'no');
//     document.querySelector(".quantity3").innerHTML = "36";

//     var elem = document.createElement('A');
//     document.querySelector('.rules').insertBefore(elem, document.querySelector(".option-text"));
//     elem.classList.add('quantity', "quantity2");
//     elem.setAttribute('data-quant', 'no');
//     document.querySelector(".quantity2").innerHTML = "24";

//     var elem = document.createElement('A');
//     document.querySelector('.rules').insertBefore(elem, document.querySelector(".option-text"));
//     elem.classList.add('quantity', 'quantity1');
//     elem.setAttribute('data-quant', 'yes');
//     document.querySelector(".quantity1").innerHTML = "12";
// }

// function createGameStuff() {
//     document.querySelector(".rules").innerHTML = " ";
//     document.querySelector(".rules").style.width = "80%";

//     switch (selectedQuantity) {
//         case 'quantity quantity2':
//             selectedQuantity = 24;
//             break;

//         case 'quantity quantity3':
//             selectedQuantity = 36;
//             break;

//         default:
//             selectedQuantity = 12;
//             break;
//     }

//     switch (selectedCardShirt) {
//         case 'card card-shirt2':
//             selectedCardShirt = 'card-shirt2';
//             break;

//         case 'card card-shirt3':
//             selectedCardShirt = 'card-shirt3';
//             break;

//         default:
//             selectedCardShirt = 'card-shirt1';
//             break;
//     }

//     addCard();
// }

// function addCard() {								//create array of cards and random sort them

//     var cardsPack = [];

//     for (var i = 0; i < selectedQuantity / 3; i++) {
//         var elem = document.createElement('A');
//         elem.classList.add('card', 'card-flipside1');
//         cardsPack[i] = elem;
//     }

//     for (var i = 0; i < selectedQuantity / 3; i++) {
//         var elem = document.createElement('A');
//         elem.classList.add('card', 'card-flipside2');
//         cardsPack[i + selectedQuantity / 3] = elem;
//     }

//     for (var i = 0; i < selectedQuantity / 3; i++) {
//         var elem = document.createElement('A');
//         elem.classList.add('card', 'card-flipside3');
//         cardsPack[i + selectedQuantity / 3 * 2] = elem;
//     }

//     cardsPack.sort(compareRandom);

//     function compareRandom(a, b) {
//         return Math.random() - 0.5;
//     }

//     for (var i = 0; i < cardsPack.length; i++) {
//         var newWrapper = document.createElement('DIV');
//         document.querySelector('.rules').appendChild(newWrapper);
//         newWrapper.classList.add('wrapper', 'new-div');
//         elem = cardsPack[i];
//         document.querySelector('.new-div').appendChild(elem);
//         elem.style.position = "absolute";
//         elem = document.createElement('A');
//         document.querySelector('.new-div').appendChild(elem);
//         elem.classList.add('card', selectedCardShirt);
//         elem.setAttribute('data-flip', 'no');
//         elem.style.position = "absolute";
//         newWrapper.classList.remove('new-div');
//     }
// }

// var a = 0;

// var valueFlips = 0;

// var firstCard;
// var secondCard;

// function flipCard() {
//     switch (a) {
//         case 0:
//             event.target.parentNode.classList.add('flipped');
//             firstCard = event.target.parentNode.firstChild.classList;
//             a++;
//             valueFlips++;
//             break;
//         case 1:
//             event.target.parentNode.classList.add('flipped');
//             secondCard = event.target.parentNode.firstChild.classList;
//             a++;
//             setTimeout(checkValue, 5000);
//             valueFlips++;
//             break;
//     }

// }

// function checkValue() {								//check flipside of cards
//     if (firstCard.value == secondCard.value) {
//         document.querySelector(".flipped").innerHTML = " ";
//         document.querySelector('.flipped').classList.remove('flipped');
//         document.querySelector(".flipped").innerHTML = " ";
//         document.querySelector('.flipped').classList.remove('flipped');
//         searchCards();
//         a = 0;
//     } else {
//         document.querySelector('.flipped').classList.remove('flipped');
//         document.querySelector('.flipped').classList.remove('flipped');
//         a = 0;
//     }
// }

// function searchCards() {							//add records
//     var searchCards = document.querySelectorAll('.card').length;
//     if (searchCards == 0) {
//         playerScore = Math.round(100 * selectedQuantity / valueFlips);
//         localStorage.setItem('player', playerName);
//         localStorage.setItem('playerRecords', playerScore);
//     }
// }