class Card {
    constructor(params) {
        this.name = params.name;
        this.value = params.value;
        this.suit = params.suit;
        this.srcPath = null;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.handCards = [new Array(), new Array()];
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
                this.players[i].handCards[indexHand].push(this.deck.pop());
            }
        }
    }

    createStartHand() {
        for (let i=0; i< this.players.length; i++) {
            this.getCardFromDeck(this.players[i].name)
            this.getCardFromDeck(this.players[i].name)
        }
    }

    createGame() {
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
    gameTable.createGame();
    let players = gameTable.players;
    
    console.log(players)
}

function load13JsonCards(suit) {
    let cardsJson = [
        { "suit": suit, "name": "Ace", "value": 1 },
        { "suit": suit, "name": "2", "value": 2 },
        { "suit": suit, "name": "3", "value": 3 },
        { "suit": suit, "name": "4", "value": 4 },
        { "suit": suit, "name": "5", "value": 5 },
        { "suit": suit, "name": "6", "value": 6 },
        { "suit": suit, "name": "7", "value": 7 },
        { "suit": suit, "name": "8", "value": 8 },
        { "suit": suit, "name": "9", "value": 9 },
        { "suit": suit, "name": "10", "value": 10 },
        { "suit": suit, "name": "Jack", "value": 10 },
        { "suit": suit, "name": "Queen", "value": 10 },
        { "suit": suit, "name": "King", "value": 10 }       
    ]

    return cardsJson;
}

