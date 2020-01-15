"use strict";

addEventListener("click", function(event) {
    switch (event.target.className) {
    	case 'menu-btn records-btn': 		
    		openRecords();
    		break;

    	case 'menu-btn new-game-btn': 			
    		newGame();
    		break;

    	case 'menu-btn close-records-btn': 		
    		closeRecords();
    		break;

    	case 'menu-btn accept-btn': 			
    		acceptButton();
    		break;

    	case 'menu-btn yes-btn': 				
    		// document.location.reload();
    		startGame();
    		document.querySelector(".disabled").style.display = "none";
			document.querySelector(".new-game").style.display = "none";
    		break;

    	case 'menu-btn no-btn': 				
    		closeNewGame();
    		break;

    	case 'menu-btn start-btn': 				
    		finishRegistration();
    		break;
    }

    switch (event.target.getAttribute('data-select')) { 		
    	case 'no':
    	chooseCardShirt();
    	break;
    }

    switch (event.target.getAttribute('data-quant')) { 			
    	case 'no':
    	chooseQuantity();
    	break;
    }

    switch (event.target.getAttribute('data-flip')) { 			
    	case 'no':
    	flipCard();
    	break;
    }
 });

var gameIsActive = false;
	
function newGame() {											//new game
	if (gameIsActive === false) {								
		gameIsActive = true;
		startGame();											
	} else {
		document.querySelector(".disabled").style.display = "block"; 		//reload game
		document.querySelector(".new-game").style.display = "block";
	}
}

var playerName = "";
var playerScore = 0;
var playerEmail = "";

function startGame() { 														//check user
	if (localStorage.getItem('player') != null) {							
		playerName = localStorage['player'];
		console.log(playerName);
		document.querySelector(".registration").style.display = "none";
		document.querySelector(".disabled").style.display = "none";
		document.querySelector(".rules").innerHTML = " ";
		createChoseCardShirt();												
	} else {
		startRegistration()													
	}
}

function startRegistration() {												//open registration
	document.querySelector(".registration").style.display = "flex";
	document.querySelector(".disabled").style.display = "block";
}


function finishRegistration() { 											//form validation
	if (document.querySelector('#name').value == "" || document.querySelector('#lastname').value == "" 
		|| document.querySelector('#mail').value == "") {
		alert("Please, fill in form fields.");
	} else {
		playerName = document.querySelector('#name').value + " " + document.querySelector('#lastname').value;
		document.querySelector(".registration").style.display = "none";
		document.querySelector(".disabled").style.display = "none";
		document.querySelector(".rules").innerHTML = " ";
		createChoseCardShirt();												
	}	
}

function openRecords() {													//open a table of records
	document.querySelector(".records-table").style.display = "flex";
	document.querySelector(".disabled").style.display = "block";
}

function closeRecords() {													//close a table of records
	document.querySelector(".records-table").style.display = "none";
	document.querySelector(".disabled").style.display = "none";
}

function closeNewGame() {													//close a menu of reload game
	document.querySelector(".new-game").style.display = "none";
	document.querySelector(".disabled").style.display = "none";
}

var scoreTable = [];


function createChoseCardShirt() {											
	document.querySelector(".rules").style.display = "flex";
	document.querySelector(".rules").style.justifyContent = "space-between";
	document.querySelector(".rules").style.flexWrap = "wrap";

	var elem = document.createElement('A');
	document.querySelector('.rules').appendChild(elem);
	elem.classList.add('card','card-shirt1');
	elem.setAttribute('data-select', 'yes');

	var elem = document.createElement('A');
	document.querySelector('.rules').appendChild(elem);
	elem.classList.add('card','card-shirt2');
	elem.setAttribute('data-select', 'no');

	var elem = document.createElement('A');
	document.querySelector('.rules').appendChild(elem);
	elem.classList.add('card','card-shirt3');
	elem.setAttribute('data-select', 'no');

	var elem = document.createElement('DIV');
	document.querySelector('.rules').appendChild(elem);
	elem.classList.add('option-text');
	elem.innerHTML = "Choose style shirt for your cards";

	var elem = document.createElement('A');
	document.querySelector('.rules').appendChild(elem);
	elem.classList.add('menu-btn','accept-btn');
	document.querySelector(".accept-btn").innerHTML = "ACCEPT";
	document.querySelector(".accept-btn").style.alignSelf = "flex-end";
}

var selectedCardShirt = 'card card-shirt1';
var selectedQuantity = 'quantity quantity1';

function chooseCardShirt() {											//select the shirt of cards
	document.querySelector("[data-select = 'yes']").dataset.select = "no";
	event.target.dataset.select = "yes";
	selectedCardShirt = document.querySelector("[data-select = 'yes']").className;
	console.log(selectedCardShirt);
}

function chooseQuantity() {												//select the number of cards
	document.querySelector("[data-quant = 'yes']").dataset.quant = "no";
	event.target.dataset.quant = "yes";
	selectedQuantity = document.querySelector("[data-quant = 'yes']").className;
}

var acceptNumber = 1;

function acceptButton() {												
	if (acceptNumber == 1) {
		for (var i = 3; i > 0; i--) {
			document.querySelector(".card").remove(".card");
		}
		createCardQuantity();											
		acceptNumber++;
	} else {
		createGameStuff();												
	}
}

function createCardQuantity() {											//pick complexity
	document.querySelector(".option-text").innerHTML = "Choose quantity of cards";

	var elem = document.createElement('A');
	document.querySelector('.rules').insertBefore(elem, document.querySelector(".option-text"));
	elem.classList.add('quantity', "quantity3");
	elem.setAttribute('data-quant', 'no');
	document.querySelector(".quantity3").innerHTML = "36";

	var elem = document.createElement('A');
	document.querySelector('.rules').insertBefore(elem, document.querySelector(".option-text"));
	elem.classList.add('quantity',"quantity2");
	elem.setAttribute('data-quant', 'no');
	document.querySelector(".quantity2").innerHTML = "24";

	var elem = document.createElement('A');
	document.querySelector('.rules').insertBefore(elem, document.querySelector(".option-text"));
	elem.classList.add('quantity','quantity1');
	elem.setAttribute('data-quant', 'yes');
	document.querySelector(".quantity1").innerHTML = "12";
}

function createGameStuff() {							
	document.querySelector(".rules").innerHTML = " ";
	document.querySelector(".rules").style.width = "80%";

	switch (selectedQuantity) {
		case 'quantity quantity2':
			selectedQuantity = 24;
			break;

		case 'quantity quantity3':
			selectedQuantity = 36;
			break;

		default:
			selectedQuantity = 12;
			break;
	}

	switch (selectedCardShirt) {
		case 'card card-shirt2':
			selectedCardShirt = 'card-shirt2';
			break;

		case 'card card-shirt3':
			selectedCardShirt = 'card-shirt3';
			break;

		default:
			selectedCardShirt = 'card-shirt1';
			break;
	}

	addCard();
}

function addCard() {								//create array of cards and random sort them
													 
	var cardsPack = [];								

	for (var i = 0; i < selectedQuantity/3; i++) {
		var elem = document.createElement('A');
		elem.classList.add('card', 'card-flipside1');
		cardsPack[i] = elem;
	}

	for (var i = 0; i < selectedQuantity/3; i++) {
		var elem = document.createElement('A');
		elem.classList.add('card','card-flipside2');
		cardsPack[i+selectedQuantity/3] = elem;
	}

	for (var i = 0; i < selectedQuantity/3; i++) {
		var elem = document.createElement('A');
		elem.classList.add('card','card-flipside3');
		cardsPack[i+selectedQuantity/3*2] = elem;
	}

	cardsPack.sort(compareRandom);

		function compareRandom(a, b) {
  			return Math.random() - 0.5;
		}	

	for (var i = 0; i < cardsPack.length; i++) {
		var newWrapper = document.createElement('DIV');
		document.querySelector('.rules').appendChild(newWrapper);
		newWrapper.classList.add('wrapper', 'new-div');
		elem = cardsPack[i];
		document.querySelector('.new-div').appendChild(elem);
		elem.style.position = "absolute";
		elem = document.createElement('A');
		document.querySelector('.new-div').appendChild(elem);
		elem.classList.add('card', selectedCardShirt);
		elem.setAttribute('data-flip', 'no');
		elem.style.position = "absolute";
		newWrapper.classList.remove('new-div');
	}
}

var a = 0;

var valueFlips = 0;

var firstCard;
var secondCard;

function flipCard() {								
	switch (a) {
		case 0:
			event.target.parentNode.classList.add('flipped');
			firstCard = event.target.parentNode.firstChild.classList;
			a++;
			valueFlips++;
			break;
		case 1:
			event.target.parentNode.classList.add('flipped');
			secondCard = event.target.parentNode.firstChild.classList;
			a++;
			setTimeout(checkValue,5000);
			valueFlips++;
			break;
	}
	
}

function checkValue() {								//check flipside of cards
	if (firstCard.value == secondCard.value) {
		document.querySelector(".flipped").innerHTML = " ";
		document.querySelector('.flipped').classList.remove('flipped');
		document.querySelector(".flipped").innerHTML = " ";
		document.querySelector('.flipped').classList.remove('flipped');
		searchCards();
	a = 0;
	} else {
		document.querySelector('.flipped').classList.remove('flipped');
		document.querySelector('.flipped').classList.remove('flipped');
		a = 0;
	}
}

function searchCards() {							//add records
	var searchCards = document.querySelectorAll('.card').length;
	if (searchCards == 0) {
		playerScore = Math.round(100*selectedQuantity/valueFlips);
		localStorage.setItem('player', playerName);
		localStorage.setItem('playerRecords', playerScore);
	}
}