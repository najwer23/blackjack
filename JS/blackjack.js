class Card {
    constructor(params) {
        this.name = params.name;
        this.value = params.value;
        this.suit = params.suit;
        this.srcName = params.srcName;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.handCards = [ 
            { 
                "cards": new Array(), 
                "isPass": false,
                "sumCards": 0
            },
            { 
                "cards": new Array(), 
                "isPass": false,
                "sumCards": 0
            }
        ]
    }
}

class GameTable {
    constructor(players) {
        this.deck = null;
        this.players = players;
    }

    fisherShuffleDeck() {
        let randomNumber;
        let cardObj;
        
        for (let i=0; i<this.deck.length; i++) {
            randomNumber = Math.floor(Math.random() * this.deck.length);
            cardObj = this.deck[randomNumber];
            this.deck[randomNumber] = this.deck[i];
            this.deck[i] = cardObj;
        }
    }

    loadNewDeck() {
        let deckArrJson = [].concat(
            load13JsonCards("Clubs"),
            load13JsonCards("Diamonds"),
            load13JsonCards("Hearts"),
            load13JsonCards("Spades"),
        )

        let deckArrObj = new Array();
        let cardObj;

        for (let i=0; i<deckArrJson.length; i++) {
            cardObj = new Card(deckArrJson[i])
            deckArrObj.push(cardObj)
        }

        this.deck = deckArrObj;
    }

    getCardFromDeck(playerName, isSplit = false) {
        for (let i=0; i< this.players.length; i++) {
            if (playerName == this.players[i].name) {
                let indexHand = isSplit ? 1 : 0;
                this.players[i].handCards[indexHand].cards.push(this.deck.pop());
            }
        }
    }

    createStartHand() {
        for (let i=0; i< this.players.length; i++) {
            this.getCardFromDeck(this.players[i].name)
            this.getCardFromDeck(this.players[i].name)
        }
    }

    createBlackjack() {
        this.loadNewDeck();
        this.fisherShuffleDeck();
        this.createStartHand();
    }

}

window.onload = function () {
    let players = [
        new Player("Croupier"),
        new Player("Player")
    ];

    let gameTable = new GameTable(players);

    runBlackjack(gameTable);
}

function runBlackjack(gameTable) {
    gameTable.createBlackjack();
    let players = gameTable.players;
    updateCardsOnTheTableForBlackjack(players);

    document.querySelector("#players").addEventListener('click', function (e) {

        if (e.target.className == 'button-hit') {
            let buttons = this.querySelectorAll(".player-cards-column-left .button-hit");
            for (let i=0; i<buttons.length; i++) {
                if (e.target == buttons[i] && !players[i+1].handCards[0].isPass) {
                    gameTable.getCardFromDeck(players[i+1].name)
                    updateCardsSumForBlackjack(players);
                    updateCardsOnTheTableForBlackjack(players);
                }
            }

            buttons = this.querySelectorAll(".player-cards-column-right .button-hit");
            for (let i=0; i<buttons.length; i++) {
                if (e.target == buttons[i] && !players[i+1].handCards[1].isPass) {
                    gameTable.getCardFromDeck(players[i+1].name, true)
                    updateCardsSumForBlackjack(players);
                    updateCardsOnTheTableForBlackjack(players);
                }
            }
        }

        if (e.target.className == 'button-stand') {
            let buttons = this.querySelectorAll(".player-cards-column-left .button-stand");
            for (let i=0; i<buttons.length; i++) {
                if (e.target == buttons[i]) {
                    players[i+1].handCards[0].isPass = true;
                    updateCardsSumForBlackjack(players);
                    updateCardsOnTheTableForBlackjack(players);
                }
            }

            buttons = this.querySelectorAll(".player-cards-column-right .button-stand");
            for (let i=0; i<buttons.length; i++) {
                if (e.target == buttons[i]) {
                    players[i+1].handCards[1].isPass = true;
                    updateCardsSumForBlackjack(players);
                    updateCardsOnTheTableForBlackjack(players);
                }
            }
        }

        if (e.target.className == 'button-split') {
            let buttons = this.querySelectorAll(".player-cards-column-left .button-split");
            for (let i=0; i<buttons.length; i++) {
                if (e.target == buttons[i]) {
                    players[i+1] = splitCardsPlayer(players[i+1]);
                    updateCardsOnTheTableForBlackjack(players);
                }
            }
        }
    });
}

function splitCardsPlayer(player) {
    let card = player.handCards[0].cards.pop();
    player.handCards[1].cards.push(card);
    return player;
}

function updateCardsSumForBlackjack(players) {
    let cardsValueAceAs1, cardsValueAceAs10, cardsArr, cardValue, selectedCardValue;
    let BLACK_JACK = 21;

    for (let i=0; i<players.length; i++) {
        for (let j=0; j<players[i].handCards.length; j++) {

            cardsArr = players[i].handCards[j].cards;
            cardsValueAceAs1 = cardsValueAceAs10 = 0;

            for (let k=0; k<cardsArr.length; k++) {
                cardValue = cardsArr[k].name == "Ace" ? 11 : cardsArr[k].value;
                cardsValueAceAs10 += cardValue;
                cardsValueAceAs1 += cardsArr[k].value;
            }

            selectedCardValue = cardsValueAceAs10 > BLACK_JACK ? cardsValueAceAs1 : cardsValueAceAs10;
            players[i].handCards[j].sumCards = selectedCardValue;
            players[i].handCards[j].isPass = selectedCardValue > BLACK_JACK ? true : players[i].handCards[j].isPass;
        }
    }
}

function updateCardsOnTheTableForBlackjack(players) {
    let cardsArr, partClassName, handleClassElement, cardsToShow;
    for (let i=0; i<players.length; i++) {
        for (let j=0; j<players[i].handCards.length; j++) {
            
            partClassName = j == 0 ? "left" : "right";
            cardsToShow = "";
            cardsArr = players[i].handCards[j].cards;
            
            for (let k=0; k<cardsArr.length; k++) {
                cardsToShow += '<img src="'+"IMG/cards/"+cardsArr[k].srcName+'" width="auto" height="120px">';
            }

            if (players[i].name == "Croupier") {
                handleClassElement = document.querySelector(".dealer-cards-column-"+partClassName+"-view");
            } 

            if (players[i].name != "Croupier") {
                handleClassElement = document.querySelectorAll(".player-cards-column-"+partClassName+"-view")[i-1];
            } 

            if (handleClassElement != null) {
                handleClassElement.innerHTML = cardsToShow;
            }
        } 
    }
}

function load13JsonCards(suit) {
    let cardsJson = [
        { "suit": suit, "name": "Ace", "value": 1, "srcName": suit+"_Ace.png"},
        { "suit": suit, "name": "2", "value": 2, "srcName": suit+"_2.png" },
        { "suit": suit, "name": "3", "value": 3, "srcName": suit+"_3.png" },
        { "suit": suit, "name": "4", "value": 4, "srcName": suit+"_4.png" },
        { "suit": suit, "name": "5", "value": 5, "srcName": suit+"_5.png" },
        { "suit": suit, "name": "6", "value": 6, "srcName": suit+"_6.png" },
        { "suit": suit, "name": "7", "value": 7, "srcName": suit+"_7.png" },
        { "suit": suit, "name": "8", "value": 8, "srcName": suit+"_8.png" },
        { "suit": suit, "name": "9", "value": 9, "srcName": suit+"_9.png" },
        { "suit": suit, "name": "10", "value": 10, "srcName": suit+"_10.png" },
        { "suit": suit, "name": "Jack", "value": 10, "srcName": suit+"_Jack.png" },
        { "suit": suit, "name": "Queen", "value": 10, "srcName": suit+"_Queen.png" },
        { "suit": suit, "name": "King", "value": 10, "srcName": suit+"_King.png" }       
    ]

    return cardsJson;
}

