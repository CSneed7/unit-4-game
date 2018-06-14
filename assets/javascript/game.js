var dragons, gameStatus

function gameStart() {
    dragons = resetDragons()
    gameStatus = resetGameStatus()

    renderDragons()
}

function resetDragons() {
    return {
        'fireDragon': {
            name: 'Fire Dragon',
            health: 180,
            attack: 8,
            imageUrl: 'assets/images/fire-dragon.jpg',
            counterStrike: 15
        },
        'waterDragon': {
            name: 'Water Dragon',
            health: 160,
            attack: 10,
            imageUrl: 'assets/images/water-dragon.jpg',
            counterStrike: 8
        },
        'earthDragon': {
            name: 'Earth Dragon',
            health: 210,
            attack: 5,
            imageUrl: 'assets/images/earth-dragons.jpg',
            counterStrike: 10
        },
        'lightningDragon': {
            name: 'Lightning Dragon',
            health: 120,
            attack: 15,
            imageUrl: 'assets/images/lightning-dragons.jpg',
            counterStrike: 25
        },
    }
}

function resetGameStatus() {
    return {
        selectedDragon: null,
        selectedDefender: null,
        enemiesRemain: 0,
        numAttacks: 0,
    }
}

function createDragDiv (dragon, key) {
    var dragDiv = $("<div class='dragon' data-name='" + key + "'>")
    var dragName = $("<div class='dragon-name'>").text(dragon.name)
    var dragImage = $("<img alt='image' class='dragon-image'>").attr('src', dragon.imageUrl)
    var dragHealth = $("<div class='dragon-health'>").text(dragon.health)
    dragDiv.append(dragName).append(dragImage).append(dragHealth)
    return dragDiv
}

function renderDragons() {
    console.log('rendering dragons')

    var keys = Object.keys(dragons)
    for (var i = 0; i < keys.length; i++) {
        var dragonKey = keys[i]
        var dragon = dragons[dragonKey]
        var dragDiv = createDragDiv(dragon, dragonKey)
        $('#dragon-area').append(dragDiv)
    }
}

function renderOthers (selectedDragonKey) {
    var dragonKeys = Object.keys(dragons)
    for (var i = 0; i < dragonKeys.length; i++) {
        if (dragonKeys[i] !== selectedDragonKey) {
            var enemyKey = dragonKeys[i]
            var enemy = dragons[enemyKey]

            var enemyDiv = createDragDiv(enemy, enemyKey)
            $(enemyDiv).addClass('enemy')
            $('#available-to-attack-selection').append(enemyDiv)
        }
    }
}

function enableEnemyPick() {
    $('.enemy').on('click.enemySelect', function () {
        console.log('other selected')
        var opponentKey = $(this).attr('data-name')
        gameStatus.selectedDefender = dragons[opponentKey]

        $('#defender').append(this)

        $('#attack-button').show()
        $('.enemy').off('click.enemySelect')
    })   
}

function attack (numAttacks) {
    console.log('attacking defender')
    gameStatus.selectedDefender.health -= gameStatus.selectedDragon.attack * numAttacks
    document.getElementById('attack-message').innerHTML = "Your " + gameStatus.selectedDragon.name + " did " + gameStatus.selectedDragon.attack * numAttacks;
}

function defend() {
    console.log('defender countering')
    gameStatus.selectedDragon.health -= gameStatus.selectedDefender.counterStrike
    document.getElementById('defense-message').innerHTML = "The " + gameStatus.selectedDefender.name + " did " + gameStatus.selectedDefender.counterStrike;
}

function dragDeath (dragon) {
    console.log('check if dragon is dead')
    return dragon.health <= 0
}

function gameWon() {
    console.log('check if user won')
    return gameStatus.enemiesLeft === 0
}

function attackPhase() {
    if (dragDeath(gameStatus.selectedDragon)) {
        document.getElementById('game-message').innerHTML = "You were slain by the " + gameStatus.selectedDefender.name + ". Click reset to play again.";

        $('selected-dragon').empty()
        $('#reset-button').show()

        return true
    } 
    else if (dragDeath(gameStatus.selectedDefender)) {
        console.log('defender death')

        gameStatus.enemiesLeft--
        $('#defender').empty()

        if (gameWon()) {
            document.getElementById('game-message').innerHTML = "You won! Click reset to play again.";
            $('#reset-button').show()
        }
        else {
            document.getElementById('game-message').innerHTML = "You slayed the " + gameStatus.selectedDefender.name + "! Select another Dragon to fight.";
            enableEnemyPick();
        }
        return true
    }
    return false
}

function emptyDivs() {
    $('#selected-dragon').empty();
    $('#defender').empty();
    $('#available-to-attack-section .enemy').empty();
    $('#dragon-area').empty();
    $('#dragons-section').show();
    $('#game-message').empty();
    $('#attack-message').empty();
    $('#defense-message').empty();
}

$(document).ready(function () {
    $('#dragon-area').on('click', '.dragon', function(){
        var selectedKey = $(this).attr('data-name');
        gameStatus.selectedDragon = dragons[selectedKey];
        console.log('dragon selected');

        $('#selected-dragon').append(this);

        renderOthers(selectedKey);

        $('#dragons-section').hide();

        gameStatus.enemiesLeft = Object.keys(dragons).length - 1;
        enableEnemyPick();
    })

    $('#attack-button').on('click.attack', function(){
        console.log('attack clicked');
        gameStatus.numAttacks++;

        attack(gameStatus.numAttacks);
        defend();

        $('#selected-dragon .dragon-health').text(gameStatus.selectedDragon.health);
        $('#defender .dragon-health').text(gameStatus.selectedDefender.health);

        if (attackPhase()) {
            $(this).hide();
        }
    })

    $('#reset-button').on('click.reset', function(){
        console.log('resetting game');

        emptyDivs();

        $(this).hide();

        gameStart();
    })

    gameStart();
})