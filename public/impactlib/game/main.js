ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
    'game.levels.Apartment1',
    'game.levels.Apartment2',
    'impact.timer',
    'impact.debug.debug'
)
.defines(function(){

MyGame = ig.Game.extend({
	// Load a font
	font: new ig.Font( 'media/04b03.font.png'),
	gravity: 300,
    statText: new ig.Font('media/04b03.font.png'),
    showStats: false,
    statMatte: new ig.Image('media/stat-matte.png'),
    levelTimer: new ig.Timer(),
    levelExit: null,
    lives: 3,
    stats: {time: 0, kills: 0, deaths: 0},
    instructText: new ig.Font('media/04b03.font.png'),
    lifeSprite: new ig.Image('media/life-sprite.png'),
	init: function() {
		// Initialize your game here; bind keys etc.
        /*ig.music.add('media/sounds/theme.*');
        ig.music.volume = 0.1;
        ig.music.play();*/

        // Bind keys
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.UP_ARROW, 'jump');
        ig.input.bind(ig.KEY.DOWN_ARROW, 'shoot');
        ig.input.bind(ig.KEY.X, 'jump');
        ig.input.bind(ig.KEY.C, 'shoot');
        ig.input.bind(ig.KEY.TAB, 'switch');
        ig.input.bind(ig.KEY.SPACE, 'continue');
        ig.input.bind(ig.KEY.MOUSE1, 'attack');

        this.loadLevel(LevelApartment1);
	},
	update: function() {
        // screen follows the player
        var player = this.getEntitiesByType(EntityPlayer)[0];
        if(player){
            this.screen.x = player.pos.x - ig.system.width/2;
            this.screen.y = player.pos.y - ig.system.height/2;
            /*if(player.accel.x > 0 && this.instructText)
                this.instructText = null;*/
        }
		// Update all entities and backgroundMaps
		if(!this.showStats){
            this.parent();
        }else{
            if(ig.input.state('continue')){
                this.showStats = false;
                this.levelExit.nextLevel();
                this.parent();
            }
        }
		
		// Add your own, additional update code here
	},
	draw: function() {
		// Draw all entities and backgroundMaps
        this.parent();
        if(this.instructText){
            var x = ig.system.width/2,
                y = ig.system.height - 10;
            this.instructText.draw('Left/Right Moves, X Jumps, C Fires & Tab Switches Weapons.',
            x, y, ig.Font.ALIGN.CENTER);
        }
        if(this.showStats){
            this.statMatte.draw(0, 0);
            var x = ig.system.width/2;
            var y = ig.system.height/2 - 20;
            this.statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);
            this.statText.draw('Time: '+this.stats.time, x, y+30, ig.Font.ALIGN.CENTER);
            this.statText.draw('Kills: '+this.stats.kills, x, y+40, ig.Font.ALIGN.CENTER);
            this.statText.draw('Deaths: '+this.stats.deaths, x, y+50, ig.Font.ALIGN.CENTER);
            this.statText.draw('Press Spacebar to continue.', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
        }
        this.statText.draw("Lives", 5,5);
        for(var i=0; i < this.lives; i++)
            this.lifeSprite.draw(((this.lifeSprite.width + 2) * i)+5, 15);
    },
    loadLevel: function(data){
        this.stats = {time: 0, kills: 0, deaths: 0};
        this.parent(data);
        this.levelTimer.reset();
    },
    toggleStats: function(levelExit){
        this.showStats = true;
        this.stats.time = Math.round(this.levelTimer.delta());
        this.levelExit = levelExit;
    },
    gameOver: function(){
        ig.finalStats = ig.game.stats;
        ig.system.setGame(GameOverScreen);
    }
});

StartScreen = ig.Game.extend({
    mainCharacter: new ig.Image('media/dexter-title-screen.png'),
    title: new ig.Image('media/dexter-title-text.png'),
    instructText: new ig.Font('media/04b03.font.png'),
    background: new ig.Image('media/screen-bg.png'),
    /*background: new ig.Image('media/dexter_title_screen.png'),*/
    init: function(){
        ig.input.bind(ig.KEY.SPACE, 'start');
    },
    update: function(){
        if(ig.input.pressed('start')){
            ig.system.setGame(MyGame)
        }
        this.parent();
    },
    draw: function(){
        this.parent();
        this.background.draw(0,0);
        this.mainCharacter.draw(0,0);
        this.title.draw(ig.system.width - this.title.width, 0);
        var x = ig.system.width/2,
            y = ig.system.height - 10;
        this.instructText.draw('Press Spacebar to Start', x+40, y, ig.Font.ALIGN.CENTER);
    }
});

GameOverScreen = ig.Game.extend({
   instructText: new ig.Font('media/04b03.font.png'),
    background: new ig.Image('media/screen-bg.png'),
    gameOver: new ig.Image('media/game-over.png'),
    stats: {},
    init: function(){
        ig.input.bind(ig.KEY.SPACE, 'start');
        this.stats = ig.finalStats;
    },
    update: function(){
        if(ig.input.pressed('start')){
            ig.system.setGame(StartScreen)
        }
        this.parent();
    },
    draw: function(){
        this.parent();
        this.background.draw(0, 0);
        var x = ig.system.width/2;
        var y = ig.system.height/2 - 20;
        this.gameOver.draw(x - (this.gameOver.width *.5), y - 30);
        var score = (this.stats.kills * 100) - (this.stats.deaths * 50);
        this.instructText.draw('Total Kills: '+this.stats.kills, x, y+30, ig.Font.ALIGN.CENTER);
        this.instructText.draw('Total Deaths: '+this.stats.deaths, x, y+40, ig.Font.ALIGN.CENTER);
        this.instructText.draw('Score: '+score, x, y+50, ig.Font.ALIGN.CENTER);
        this.instructText.draw('Press Spacebar to continue.', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
    }
});

if(ig.ua.mobile){
    // Disable sound for all mobile devices
    ig.Sound.enabled = false;
}
if(ig.ua.iPhone4){
    // The iPhone 4 has more pixels = we'll scale the game by a factor of 4
    ig.main('#canvas', MyGame, 60, 160, 160, 4);
}else if(ig.ua.mobile){
    // All other mobile devices
    ig.main('#canvas', MyGame, 60, 160, 160, 2);
}else{
    // Desktop browsers
    ig.main( '#canvas', StartScreen, 60, 440, 360, 2);
}
// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
//ig.main( '#canvas', MyGame, 60, 440, 360, 2 );

});
