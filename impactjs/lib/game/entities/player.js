/**
 * Created by steven on 6/23/14.
 */
ig.module(
    'game.entities.player'
)
.requires(
        'impact.entity',
        'impact.sound'
    )
    .defines(function(){
        EntityPlayer = ig.Entity.extend({
            animSheet: new ig.AnimationSheet('media/player.png', 16, 16),
            jumpSFX: new ig.Sound('media/sounds/jump.*'),
            shootSFX: new ig.Sound('media/sounds/shoot.*'),
            deathSFX: new ig.Sound('media/sounds/death.*'),
            size: {x: 8, y:14},
            offset: {x: 4, y: 2},
            flip: false,
            maxVel: {x: 100, y: 150},
            friction: {x: 600, y:0},
            accelGround: 400,
            accelAir: 200,
            jump: 200,
            type: ig.Entity.TYPE.A,
            checkAgainst: ig.Entity.TYPE.NONE,
            collides: ig.Entity.COLLIDES.PASSIVE,
            weapon: 0,
            totalWeapons: 2,
            activeWeapon: "EntityBullet",
            startPosition: null,
            invincible: true,
            invincibleDelay: 2,
            invincibleTimer: null,
            _wmDrawBox: true,
            _wmBoxColor: 'rgba(255, 0, 0, 0.7)',
            init: function( x, y, settings){
                this.startPosition = {x:x, y:y};
                this.parent(x, y, settings);
                // Add the animations
                this.setupAnimation(this.weapon);
                this.invincibleTimer = new ig.Timer();
                this.makeInvincible();
                /*this.addAnim('idle', 1, [0]);
                this.addAnim('run', 0.07, [0,1,2,3,4,5]);
                this.addAnim('jump', 1, [9]);
                this.addAnim('fall', 0.4, [6,7]);*/
            },
            setupAnimation: function(offset){
              offset = offset * 10;
                this.addAnim('idle', 1, [0+offset]);
                this.addAnim('run',.07, [0+offset,1+offset,2+offset,3+offset,4+offset,5+offset]);
                this.addAnim('jump', 1, [9+offset]);
                this.addAnim('fall', 0.4, [6+offset,7+offset]);
            },
            makeInvincible: function(){
                this.invincible = true;
                this.invincibleTimer.reset();
            },
            receiveDamage: function(amount, from){
                if(this.invincible)
                    return;
                this.parent(amount, from);
            },
            draw: function(){
                if(this.invincible)
                    this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1;
                this.parent();
            },
            update: function(){
                // move left or right
                var accel = this.standing ? this.accelGround : this.accelAir;
                if(ig.input.state('left')){
                    this.accel.x = -accel;
                    this.flip = true;
                }else if(ig.input.state('right')){
                    this.accel.x = accel;
                    this.flip = false;
                }else{
                    this.accel.x = 0;
                }
                // jump
                if(this.standing && ig.input.pressed('jump')){
                    this.vel.y = -this.jump;
                    this.jumpSFX.volume = 0.1;
                    this.jumpSFX.play();
                }
                // shoot
                if(ig.input.pressed('shoot')){
                    ig.game.spawnEntity(this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip});
                    this.shootSFX.volume = 0.2;
                    this.shootSFX.play();
                }

                if(ig.input.pressed('attack')) { //Basic shoot command     
                    var mx = (ig.input.mouse.x + ig.game.screen.x); //Figures out the x coord of the mouse in the entire world
                    var my = (ig.input.mouse.y + ig.game.screen.y); //Figures out the y coord of the mouse in the entire world
                    var r = Math.atan2(my-this.pos.y, mx-this.pos.x); //Gives angle in radians from player's location to the mouse location, assuming directly right is 0
                    /*
                    Honestly, the above should probably take into account offsets of where your gun is located, 
                    but that greatly overcomplicates this snippet since most of you are going to have different exit points for the barrel of your weapons

                    Furthermore, each weapon might even have different exit points, so you might want to move the angle calculation into the init method of
                    each bullet
                    */
                    ig.game.spawnEntity('Click'+this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip, angle:r}); //Nothing to special here, just make sure you pass the angle we calculated in
                }
                if(ig.input.state('attack')) {
                    console.log("Attack pressed");
                    var mx = (ig.input.mouse.x + ig.game.screen.x); //Figures out the x coord of the mouse in the entire world
                    var my = (ig.input.mouse.y + ig.game.screen.y); //Figures out the y coord of the mouse in the entire world
                    var r = Math.atan2(my-this.pos.y, mx-this.pos.x); //Gives angle in radians from player's location to the mouse location, assuming directly right is 0
                    ig.game.spawnEntity('Click'+this.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip, angle:r}); //Nothing to special here, just make sure you pass the angle we calculated in
                }

                // set the current animation, based on player's speed
                if(this.vel.y < 0){
                    this.currentAnim = this.anims.jump;
                }else if(this.vel.y > 0){
                    this.currentAnim = this.anims.fall;
                }else if(this.vel.x != 0){
                    this.currentAnim = this.anims.run;
                }else{
                    this.currentAnim = this.anims.idle;
                }
                // switch weapons
                if(ig.input.pressed('switch')){
                    this.weapon ++;
                    if(this.weapon >= this.totalWeapons)
                        this.weapon = 0;
                    switch(this.weapon){
                        case(0):
                            this.activeWeapon = "EntityBullet";
                            break;
                        case(1):
                            this.activeWeapon = "EntityGrenade";
                        break;
                    }
                    this.setupAnimation(this.weapon);
                }
                // flip the sprite around based on run-direction
                this.currentAnim.flip.x = this.flip;
                if(this.invincibleTimer.delta() > this.invincibleDelay){
                    this.invincible = false;
                    this.currentAnim.alpha = 1;
                }
                // move!
                this.parent();
            },
            kill: function(){
                this.deathSFX.volume = 0.2;
                this.deathSFX.play();
                this.parent();
                ig.game.respawnPosition = this.startPosition;
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack:this.onDeath});
            },
            onDeath: function(){
                ig.game.stats.deaths ++;
                ig.game.lives --;
                if(ig.game.lives <= 0){
                    ig.game.gameOver();
                }else{
                    ig.game.spawnEntity(EntityPlayer, ig.game.respawnPosition.x, ig.game.respawnPosition.y);
                }
            }
        });

        EntityBullet = ig.Entity.extend({
           size: {x: 5, y: 3},
            animSheet: new ig.AnimationSheet('media/bullet.png', 5, 3),
            maxVel: {x: 250, y: 0},
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,
            init: function(x, y, settings){
                this.parent(x + (settings.flip ? -4 : 8), y+8, settings);
                this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.addAnim('idle', 0.2, [0]);
            },
            handleMovementTrace: function(res){
                this.parent(res);
                if(res.collision.x || res.collision.y){
                    this.kill();
                }
            },
            check: function(other){
                other.receiveDamage(4, this);
                this.kill();
            }
        });

        EntityGrenade = ig.Entity.extend({
           size: {x: 4, y: 4},
            offset: {x: 2, y: 2},
            animSheet: new ig.AnimationSheet('media/grenade.png', 8, 8),
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.PASSIVE,
            maxVel: {x: 180, y: 175},
            bounciness: 0.6,
            bounceCounter: 0,
            init: function(x, y, settings){
                this.parent(x + (settings.flip ? -4 : 7), y, settings);
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.vel.y = -(50 + (Math.random()*100));
                this.addAnim('idle', 0.2, [0,1]);
            },
            handleMovementTrace: function(res){
                this.parent(res);
                if(res.collision.x || res.collision.y){
                    // only bounces 3 times
                    this.bounceCounter++;
                    if(this.bounceCounter > 3){
                        this.kill();
                    }
                }
            },
            check: function(other){
                other.receiveDamage(10, this);
                this.kill();
            },
            kill: function(){
                for(var i = 0; i < 20; i++)
                    ig.game.spawnEntity(EntityGrenadeParticle, this.pos.x, this.pos.y);
                this.parent();
            }
        });

        ClickEntityBullet = ig.Entity.extend({
           size: {x: 5, y: 3},
            animSheet: new ig.AnimationSheet('media/bullet.png', 5, 3),
            maxVel: {x: 200, y: 200},
            desiredVel: 300,
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.PASSIVE,
            init: function(x, y, settings){
                this.parent(x + (settings.flip ? -4 : 8), y+8, settings);
                var vely = Math.sin(this.angle) * this.desiredVel; //.desiredVel is just the velocity I would want if we were going in a straight line directly out of the right of the player. I just put it as a property of the entity since I refer to it in multiple locations
                var velx =  Math.cos(this.angle) * this.desiredVel;
                /*
                I'm a fan of fullspeed projectiles with no acceleration so we set the velocity, max velocity and for good measure acceleration too.
                You might want to start with a bit of velocity and some sort of acceleration so your projectile starts off slower and speeds up for something like a rocket 
                If that's the case, you'll want to do something like the following
                this.maxVel.x = whatever max you want;
                this.accel.x = Math.sin(this.angle)  * desiredAcceleration;
                this.accel.y = Math.cos(this.angle)  * desiredAcceleration;
                this.vel.x = Math.sin(this.angle)  * desiredStartingVelocity;
                this.vel.y = Math.cos(this.angle)  * desiredStartingVelocity;
                */
                this.maxVel.x = this.vel.x = this.accel.x = velx;
                this.maxVel.y = this.vel.y = this.accel.y = vely;
                this.addAnim('idle', 0.2, [0]);
                this.currentAnim.angle = this.angle;
            },
            handleMovementTrace: function(res){
                this.parent(res);
                if(res.collision.x || res.collision.y){
                    this.kill();
                }
            },
            check: function(other){
                other.receiveDamage(4, this);
                this.kill();
            }
        });

        ClickEntityGrenade = ig.Entity.extend({
           size: {x: 4, y: 4},
            offset: {x: 2, y: 2},
            animSheet: new ig.AnimationSheet('media/grenade.png', 8, 8),
            type: ig.Entity.TYPE.NONE,
            checkAgainst: ig.Entity.TYPE.BOTH,
            collides: ig.Entity.COLLIDES.PASSIVE,
            maxVel: {x: 180, y: 175},
            desiredVel: 175,
            bounciness: 0.6,
            bounceCounter: 0,
            init: function(x, y, settings){
                /*this.parent(x + (settings.flip ? -4 : 7), y, settings);
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.vel.y = -(50 + (Math.random()*100));
                this.addAnim('idle', 0.2, [0,1]);*/
                this.parent(x + (settings.flip ? -5 : 10), y, settings);
                this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
                this.vel.y = -(50 + (Math.random()*100));
                var vely = Math.sin(this.angle) * this.desiredVel; //.desiredVel is just the velocity I would want if we were going in a straight line directly out of the right of the player. I just put it as a property of the entity since I refer to it in multiple locations
                var velx =  Math.cos(this.angle) * this.desiredVel;
                /*
                I'm a fan of fullspeed projectiles with no acceleration so we set the velocity, max velocity and for good measure acceleration too.
                You might want to start with a bit of velocity and some sort of acceleration so your projectile starts off slower and speeds up for something like a rocket 
                If that's the case, you'll want to do something like the following
                this.maxVel.x = whatever max you want;
                this.accel.x = Math.sin(this.angle)  * desiredAcceleration;
                this.accel.y = Math.cos(this.angle)  * desiredAcceleration;
                this.vel.x = Math.sin(this.angle)  * desiredStartingVelocity;
                this.vel.y = Math.cos(this.angle)  * desiredStartingVelocity;
                */
                this.maxVel.x = this.vel.x = this.accel.x = velx;
                //this.maxVel.y = this.vel.y = this.accel.y = vely;
                this.addAnim('idle', 0.2, [0]);
                this.currentAnim.angle = this.angle;
            },
            handleMovementTrace: function(res){
                this.parent(res);
                if(res.collision.x || res.collision.y){
                    // only bounces 3 times
                    this.bounceCounter++;
                    if(this.bounceCounter > 3){
                        this.kill();
                    }
                }
            },
            check: function(other){
                other.receiveDamage(10, this);
                this.kill();
            },
            kill: function(){
                for(var i = 0; i < 20; i++)
                    ig.game.spawnEntity(EntityGrenadeParticle, this.pos.x, this.pos.y);
                this.parent();
            }
        });

        EntityDeathExplosion = ig.Entity.extend({
            lifetime: 1,
            callBack: null,
            particles: 25,
            init: function(x, y, settings){
                this.parent(x, y, settings);
                for(var i = 0; i < this.particles; i++)
                    ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
                    this.idleTimer = new ig.Timer();
            },
            update: function(){
                if(this.idleTimer.delta() > this.lifetime){
                    this.kill();
                    if(this.callBack)
                        this.callBack();
                    return;
                }
            }
        });

        EntityDeathExplosionParticle = ig.Entity.extend({
           size: {x: 2, y: 2},
            maxVel: {x: 160, y: 200},
            lifetime: 2,
            fadetime: 1,
            bounciness: 0,
            vel: {x: 100, y: 30},
            friction: {x: 100, y: 0},
            collides: ig.Entity.COLLIDES.LITE,
            colorOffset: 0,
            totalColors: 7,
            animSheet: new ig.AnimationSheet('media/blood.png', 2, 2),
            init: function(x, y, settings){
                this.parent(x, y, settings);
                var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors+1));
                this.addAnim('idle', 0.2, [frameID]);
                this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
                this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
                this.idleTimer = new ig.Timer();
            },
            update: function(){
                if(this.idleTimer.delta() > this.lifetime){
                    this.kill();
                    return;
                }
                this.currentAnim.alpha = this.idleTimer.delta().map(
                    this.lifetime - this.fadetime, this.lifetime, 1, 0
                );
                this.parent();
            }
        });

        EntityGrenadeParticle = ig.Entity.extend({
            size: {x: 1, y: 1},
            maxVel: {x: 160, y: 200},
            lifetime: 1,
            fadetime: 1,
            bounciness: 0,
            vel: {x: 40, y: 50},
            friction: {x: 20, y: 20},
            checkAgainst: ig.Entity.TYPE.B,
            collides: ig.Entity.COLLIDES.LITE,
            animSheet: new ig.AnimationSheet('media/explosion.png', 1, 1),
            init: function(x, y, settings){
                this.parent(x, y, settings);
                this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
                this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
                this.idleTimer = new ig.Timer();
                var frameID = Math.round(Math.random()*7);
                this.addAnim('idle', 0.2, [frameID]);
            },
            update: function(){
                if(this.idleTimer.delta() > this.lifetime){
                    this.kill();
                    return;
                }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime, 1, 0
            );
            this.parent();
            }
        });

    });