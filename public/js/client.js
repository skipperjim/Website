var socket = io('http://localhost:3700');
var playerNum = Math.floor((Math.random() * 100) + 1);
var playerName = "player" + playerNum + "";
console.log("You are " + playerName);

socket.emit('playerJoined', playerName);

socket.on('newPlayer', function (newPlayerName) {
    console.log(newPlayerName + " has joined the game");
    enemyPlayer = game.add.sprite(game.world.centerX, game.world.centerY, 'Link');
    enemyPlayer.anchor.setTo(0.5, 0.5);
    enemyPlayer.scale.x = 1.7;
    enemyPlayer.scale.y = 1.7;
    socket.emit('broadcastMyPlayer', playerName);
});

socket.on('otherPlayer', function (otherPlayerName) {
    console.log(otherPlayerName + " is spawning into your game");
    otherPlayer = game.add.sprite(game.world.centerX, game.world.centerY, 'Link');
    otherPlayer.anchor.setTo(0.5, 0.5);
    otherPlayer.scale.x = 1.7;
    otherPlayer.scale.y = 1.7;
});