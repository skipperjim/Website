game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    //game.load.image('logo', '/images/phaser/phaser.png');
    game.load.image('grass', '/phasergame/assets/tiles/light_grass.png');
    //  37x45 is the size of each frame
    //  There are 18 frames in the PNG - you can leave this value blank if the frames fill up the entire PNG, but in this case there are some
    //  blank frames at the end, so we tell the loader how many to load
    game.load.spritesheet('Link', '/phasergame/assets/sprites/LinkSpriteSheet.png', 20, 26, 30);
}

var wKey, sKey, aKey, dKey;
var sprite;
var facing = 'down';

function create() {
    land = game.add.tileSprite(0, 0, 800, 600, 'grass');
    land.fixedToCamera = true;

    // Add sprite to game world
    sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'Link');
    sprite.anchor.setTo(0.5, 0.5);
    sprite.scale.x = 1.7;
    sprite.scale.y = 1.7;

    //  This will force it to decelerate and limit its speed
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.collideWorldBounds = true;

    sprite.animations.add('up', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    sprite.animations.add('down', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);
    sprite.animations.add('left', [16, 17, 18, 19, 20, 21], 10, true);
    sprite.animations.add('right', [22, 23, 24, 25, 26, 27], 10, true);
    // Idle animations
    sprite.animations.add('idleup', [0], 10, true);
    sprite.animations.add('idledown', [9], 10, true);
    sprite.animations.add('idleleft', [19], 10, true);
    sprite.animations.add('idleright', [25], 10, true);

    sprite.bringToTop();

    game.camera.follow(sprite);
    //game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
}

function update() {

    if (wKey.isDown) {
        sprite.animations.play('up');
        facing = 'up';
        sprite.y -= 1.5;
    } else if (sKey.isDown) {
        sprite.animations.play('down');
        facing = 'down';
        sprite.y += 1.5;
    } else if (dKey.isDown) {
        if (facing != 'right') {
            sprite.animations.play('right');
            facing = 'right';
        }
        sprite.x += 1.5;
    } else if (aKey.isDown) {
        if (facing != 'left') {
            sprite.animations.play('left');
            facing = 'left';
        }
        sprite.x -= 1.5;
    } else {
        if (facing != 'idle') {
            sprite.animations.stop();
            if (facing == 'up') {
                sprite.frame = 3;
            } else if (facing == 'down') {
                sprite.frame = 12;
            } else if (facing == 'left') {
                sprite.frame = 19;
            } else if (facing == 'right') {
                sprite.frame = 25;
            }
            facing = 'idle';
        }
    }

}