    ///////////////////////////////////////////////////////////////
    //Game: Gravity Man - Justin Lawson                          //
    //Sources: Code from Phaser example "Starstruck" used        //
    //         Tilemap file from Phaser example "Starstruck" used//
    ///////////////////////////////////////////////////////////////

    window.onload = function() {

        var game = new Phaser.Game(600, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('platform', 'assets/GravityManPlatform.png');//Floor and Platform objects are not working properly//
    game.load.image('floor', 'assets/GravityManFloor.png');
    game.load.spritesheet('gravityMan', 'assets/GravityMan.png', 32, 32);//Gravity Man: The player character//
    game.load.image('coin', 'assets/GravityManCoin.png');//Coins the player must find and collect//
    game.load.image('background', 'assets/GravityManBG.png');//Background image//
    game.load.audio('coinCollect', 'assets/Electronic_Chime-KevanGC-495939803.mp3');
    game.load.audio('gravityChange', 'assets/spin_jump-Brandino480-2020916281.mp3');
}

var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var g_dir = 'down';//current direction of gravity//
var coinSound;
var gSound;
var coins;
var score = 0;
var scoreString = '';
var scoreText;
var floor;//Not working//

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 800, 600, 'background');
    bg.fixedToCamera = true;

    game.physics.arcade.gravity.y = 250;
    
    //adds sounds to the game//
    coinSound = game.add.audio('coinCollect');
    gSound = game.add.audio('gravityChange');
    coinSound.allowMultiple = true;
    gSound.allowMultiple = true;
    coinSound.addMarker('coinGet', 0, 2.0);
    gSound.addMarker('gSwitch', 0, 0.5);

    player = game.add.sprite(32, 32, 'gravityMan');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(16, 32, 8, 0);

    player.animations.add('left', [2, 3], 10, true);
    player.animations.add('right', [0, 1], 10, true);
    player.animations.add('left_up', [6, 7], 10, true);//player is facing left and gravity is up//
    player.animations.add('right_up', [4, 5], 10, true);//player is facing right and gravity is up//
    
    coins = game.add.group();
    createCoins();
    
    scoreString = 'Score: ';
    scoreText = game.add.text(10, 10, scoreString + score, {font: '34px Arial', fill: '#fff'});

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

}

function update() {

    game.physics.arcade.collide(player, floor);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        //if (facing != 'left')
        //{
            if(g_dir == 'down')
                player.animations.play('left');
            else
                player.animations.play('left_up');
            facing = 'left';
        //}
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        //if (facing != 'right')
        //{
            if(g_dir == 'down')
                player.animations.play('right');
            else
                player.animations.play('right_up');
            facing = 'right';
        //}
    }
    else
    {
        //if (facing != 'idle')
        //{
            player.animations.stop();

            if (facing == 'left')
            {
                if(g_dir == 'down')
                    player.frame = 2;
                else
                    player.frame = 6;
            }
            else if(facing == 'right')
            {
                if(g_dir == 'down')
                    player.frame = 0;
                else
                    player.frame = 4;
            }

            facing = 'idle';
        //}
    }
    
    if (jumpButton.isDown && game.time.now > jumpTimer)
    {
        //player.body.velocity.y = -250;
        game.physics.arcade.gravity.y *= -1;
        if (g_dir == 'down')//if gravity is acting downwards, set gravity to 'up'//
        {
            g_dir = 'up';
        }
        else
        {
            g_dir = 'down';
        }
        gSound.play('gSwitch');
        jumpTimer = game.time.now + 750;
    }
    
    //Check for and handles coin collisions//
    game.physics.arcade.overlap(player, coins, coinCollision, null, this);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//function createCoins(): spawns 15 coins to random coordinates with random bounce (coins will share the players gravity).  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createCoins()
{
    for(var i = 0; i < 15; i++)
    {
        var coin = coins.create((Math.random() * 600) + 1, 16, 'coin');
        game.physics.enable(coin, Phaser.Physics.ARCADE);
        coin.body.bounce.y = 1;
        coin.body.setSize(16, 16, 0, 0);
        coin.body.collideWorldBounds = true;
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//function coinCollision(coin, player)                                                                 //
//destroys the coin and adds 100 to the score. Spawns another coin with random bounce and x-coordinates//
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function coinCollision(player, coin)
{
    coin.kill();
    
    coinSound.play('coinGet');
    score += 100;
    scoreText.text = scoreString + score;
    
    var newCoin = coins.create((Math.random() * 600) + 1, 16, 'coin');
    game.physics.enable(newCoin, Phaser.Physics.ARCADE);
    newCoin.body.bounce.y = 1;
    newCoin.body.setSize(16, 16, 0, 0);
    newCoin.body.collideWorldBounds = true;
}

function render () {

    // game.debug.text(game.time.physicsElapsed, 32, 32);
    // game.debug.body(player);
    // game.debug.bodyInfo(player, 16, 24);

}

    };