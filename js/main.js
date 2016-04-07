    ///////////////////////////////////////////////////////////////
    //Game: Gravity Tank - Justin Lawson                         //
    ///////////////////////////////////////////////////////////////

    window.onload = function() {

        var game = new Phaser.Game(640, 640, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('base', 'assets/tank.png');//tank base//
    game.load.image('cannon', 'assets/cannon.png');//tank cannon//
    game.load.image('bullet', 'assets/bullet.png');//bullet sprite//
    game.load.tilemap('Tilemap', 'assets/Tile Layer 1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('Blocks', 'assets/block.png');//block used for Tilemap//
    game.load.image('turretW', 'assets/wallTurret.png');//enemy turret on wall//
    game.load.image('turretF', 'assets/groundTurret.png');//enemy turret on ground//
    game.load.audio('shot', 'assets/9_mm_gunshot-mike-koenig-123.mp3');
    game.load.audio('hit', 'assets/Bomb 2-SoundBible.com-953367492.mp3');
    game.load.audio('music', 'assets/Voice Over Under.mp3');
}

var player;
var cannon;
var facing = 'left';
var cursors;
var shootButton;
var bg;
var g_dir = 'down';
var layer;
var map;
var upGrav;
var downGrav;
var leftGrav;
var rightGrav;
var onGround = false;
var turnCW;
var turnCCW;
var bullets;
var bulletTimer = 0;
var startKey;
var isRunning = false;
var stateText;
var healthText;
var enemies;
var enemy1;//wall turret//
var enemy2;//ground turret//
var enemy3;//ground turret//
var enemyTimer = 0;//timer for enemy attacks//
var enemyBullets;
var playerHealth = 3;
var shootSFX;
var hitSFX;
var music;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#555555';

    game.physics.arcade.gravity.y = 250;
    
    map = game.add.tilemap('Tilemap');
    map.addTilesetImage('Blocks');
    map.setCollision(1);
    
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();

    player = game.add.sprite(32, 96, 'base');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    
    cannon = game.add.sprite(32, 96, 'cannon');
    game.physics.enable(cannon, Phaser.Physics.ARCADE);

    player.body.collideWorldBounds = true;
    player.body.setSize(32, 32, 0, 0);
    player.body.drag.set(100);
    
    cannon.body.collideWorldBounds = true;
    cannon.body.setSize(32, 32, 0, 0);
    cannon.anchor.setTo(.5, .5);
    
    bullets = game.add.group();
    enemyBullets = game.add.group();
    enemies = game.add.group();
    
    enemy1 = enemies.create(576, 320, 'turretW');
    game.physics.enable(enemy1, Phaser.Physics.ARCADE);
    enemy1.body.allowGravity = false;
    
    enemy2 = enemies.create(352, 320, 'turretF');
    game.physics.enable(enemy2, Phaser.Physics.ARCADE);
    enemy2.body.allowGravity = false;
    
    enemy3 = enemies.create(64, 512, 'turretF');
    game.physics.enable(enemy3, Phaser.Physics.ARCADE);
    enemy3.body.allowGravity = false;
    
    shootSFX = game.add.audio('shot');
    hitSFX = game.add.audio('hit');
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    
    stateText = game.add.text(200, 200, "Press Enter to play!", {font: '34px Arial', fill: '#000'});
    healthText = game.add.text(32, 32, "Health: " + playerHealth, {font: '34px Arial', fill: '#000'});

    cursors = game.input.keyboard.createCursorKeys();
    shootButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    upGrav = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downGrav = game.input.keyboard.addKey(Phaser.Keyboard.S);
    leftGrav = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightGrav = game.input.keyboard.addKey(Phaser.Keyboard.D);
    turnCW = game.input.keyboard.addKey(Phaser.Keyboard.E);
    turnCCW = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    startKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
}

function update() {

    game.physics.arcade.collide(player, layer);
    
    cannon.body.x = player.body.x;
    cannon.body.y = player.body.y;
    
    healthText.text = "Health: " + playerHealth;
    
    if(isRunning && player.alive)
    {
        if(g_dir == 'down' || g_dir == 'up')
        {
            if(player.body.velocity.y == 0)
            {
                player.body.velocity.x = 0;
                onGround = true;
            }
        
            else
                onGround = false;
        }
    
        if(g_dir == 'left' || g_dir == 'right')
        {
            if(player.body.velocity.x == 0)
            {
                player.body.velocity.y = 0;
                onGround = true;
            }
        
            else
                onGround = false;
        }

        if (cursors.left.isDown && (g_dir == 'down' || g_dir == 'up') && onGround)
        {
            player.body.velocity.x = -150;
        }
        else if (cursors.right.isDown && (g_dir == 'down' || g_dir == 'up') && onGround)
        {
            player.body.velocity.x = 150;
        }
        else if(cursors.up.isDown && (g_dir == 'left' || g_dir == 'right') && onGround)
        {
            player.body.velocity.y = -150;
        }
        else if(cursors.down.isDown && (g_dir == 'left' || g_dir == 'right') && onGround)
        {
            player.body.velocity.y = 150;
        }
    
        if(upGrav.isDown && onGround)
        {
            game.physics.arcade.gravity.x = 0;
            game.physics.arcade.gravity.y = -250;
            g_dir = 'up';
        }
    
        else if(downGrav.isDown && onGround)
        {
            game.physics.arcade.gravity.x = 0;
            game.physics.arcade.gravity.y = 250;
            g_dir = 'down';
        }
    
        else if(leftGrav.isDown && onGround)
        {
            game.physics.arcade.gravity.x = -250;
            game.physics.arcade.gravity.y = 0;
            g_dir = 'left';
        }
    
        else if(rightGrav.isDown && onGround)
        {
            game.physics.arcade.gravity.x = 250;
            game.physics.arcade.gravity.y = 0;
            g_dir = 'right';
        }
    
        if(turnCW.isDown)
        {
            cannon.angle += 2.5;
        }
    
        else if(turnCCW.isDown)
        {
            cannon.angle -= 2.5;
        }
    
        if(shootButton.isDown && game.time.now > bulletTimer)
        {
            shoot();
            bulletTimer = game.time.now + 500;
        }
        
        if(game.time.now >= enemyTimer && (enemy1.alive || enemy2.alive || enemy3.alive))
        {
            enemyShoot();
            enemyTimer = game.time.now + 2500;
        }
        
    }
    
    if(playerHealth <= 0)
    {
        isRunning = false;
        player.kill();
        cannon.kill();
        stateText.text = "Game Over! Enter to restart.";
        stateText.visible = true;
    }
    
    if(startKey.isDown)
    {
        if(!isRunning)
        {
            enemyTimer = game.time.now + 1000;   
            playerHealth = 3;
            game.physics.arcade.gravity.y = 250;
            game.physics.arcade.gravity.x = 0;
            player.reset(32, 96);
            cannon.reset(32, 96);
            enemy1.reset(576, 320);
            enemy2.reset(352, 320);
            enemy3.reset(64, 512);
        }
        isRunning = true;
        stateText.visible = false;
    }
    
    game.physics.arcade.overlap(bullets, layer, wallCollision, null, this);
    game.physics.arcade.overlap(enemyBullets, layer, wallCollision, null, this);
    game.physics.arcade.overlap(player, enemyBullets, playerHit, null, this);
    game.physics.arcade.overlap(bullets, enemies, enemyHit, null, this);
}
        
function shoot()
{
    var bullet = bullets.create(player.body.x + 16, player.body.y + 16, 'bullet');
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.body.setSize(8, 8, 0, 0);
    bullet.anchor.setTo(.5, .5)
    bullet.rotation = cannon.rotation;
    bullet.body.allowGravity = false;
    game.physics.arcade.velocityFromRotation(cannon.rotation, 400, bullet.body.velocity);
    shootSFX.play();
}
        
function wallCollision(bullet, layer)
{
    bullet.kill();
}
        
function enemyShoot()
{
    if(enemy1.alive)
    {
        var bullet = enemyBullets.create(enemy1.body.x + 16, enemy1.body.y + 16, 'bullet');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.setSize(8, 8, 0, 0);
        bullet.anchor.setTo(.5, .5);
        bullet.body.allowGravity = false;
        game.physics.arcade.moveToObject(bullet, player, 400);
    }
    
    if(enemy2.alive)
    {
        var bullet = enemyBullets.create(enemy2.body.x + 16, enemy2.body.y + 16, 'bullet');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.setSize(8, 8, 0, 0);
        bullet.anchor.setTo(.5, .5);
        bullet.body.allowGravity = false;
        game.physics.arcade.moveToObject(bullet, player, 400);
    }
    
    if(enemy3.alive)
    {
        var bullet = enemyBullets.create(enemy3.body.x + 16, enemy3.body.y + 16, 'bullet');
        game.physics.enable(bullet, Phaser.Physics.ARCADE);
        bullet.body.setSize(8, 8, 0, 0);
        bullet.anchor.setTo(.5, .5);
        bullet.body.allowGravity = false;
        game.physics.arcade.moveToObject(bullet, player, 400);
    }
    
    shootSFX.play();
}
        
function playerHit(player, bullet)
{
    hitSFX.play();
    bullet.kill();
    if(playerHealth > 0)
        playerHealth--;
}
        
function enemyHit(bullet, enemy)
{
    hitSFX.play();
    bullet.kill();
    enemy.kill();
}
        
function render() {}


    };