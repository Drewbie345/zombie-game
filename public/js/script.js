var game = new Phaser.Game(512, 512, Phaser.AUTO, 'game-canvas');

var main_state = {
  score: 0,

  scoreText: '',
  
  preload: function() {
    this.game.load.image('bg-far', 'images/bg-far.png');
    this.game.load.image('bg-mid', 'images/bg-mid.png');
    this.game.load.image('ground2', 'images/ground2.png');
    this.game.load.image('heart', 'images/heart_small.png')

    // this.game.load.atlasJSONHash('ground', 'images/ground.png', 'images/ground.json');
    this.game.load.atlasJSONHash('hero', 'images/hero.png', 'images/hero.json');
  },

  create: function() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    far = game.add.tileSprite(0, 0, 512, 512, 'bg-far');
    mid = game.add.tileSprite(0, 0, 512, 512, 'bg-mid');
    
    groundGroup = game.add.group();
    groundGroup.enableBody = true;
    ground = [];
    for (var i = 0; i < 4; i++) {
      ground.push(groundGroup.create(0 + (128 * i), 420, 'ground2'));
      ground[i].body.immovable = true;
    } 

    hero = game.add.sprite(100, 280, 'hero');  
    game.physics.arcade.enable(hero);

    hero.health = 50;
    hero.anchor.setTo(1, 1);
    hero.body.bounce.y = 0.2;
    hero.body.gravity.y = 100;
    hero.body.velocity.x = 0;
    hero.body.collideWorldBounds = true;

    hero.animations.add('walk', [0, 1, 2, 3], 6, true);
  
    heartsGroup = game.add.group();
    heartsGroup.enableBody = true;
    hearts = [];
    for (var i = 0; i < 8; i++) {
      hearts.push(heartsGroup.create(i * 70, (300 + i * 10), 'heart'));
      hearts[i].body.gravity.y = 6;
      hearts[i].body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    this.scoreText = game.add.text(8, 8, 'Score: 0', { fontSize: '32px', fill: 'white' });
    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(hero);
  },

  update: function() {
    game.physics.arcade.collide(hero, ground);
    game.physics.arcade.collide(heartsGroup, ground);
    game.physics.arcade.overlap(hero, heartsGroup, this.collectHeart, null, this);

    if (cursors.right.isDown) {
      hero.body.velocity.x = 10;
      hero.animations.play('walk');
      far.tilePosition.x -= 1;
      mid.tilePosition.x -= 3;
    } else if (cursors.up.isDown) {
      hero.body.velocity.y = -50;
    } else {
      hero.animations.stop();
      hero.frame = 0;
    }
  },

  restart_game: function() {
    this.game.state.start('main');
  },

  collectHeart: function(hero, heart) {
    heart.kill();
    this.score += 10;
    console.log(this.score);
    this.scoreText.text = 'Score:' + this.score;
  },

  rand_num: function(min, max) {
    return Math.random() * (max - min) + min;
  }
}

game.state.add('main', main_state);
game.state.start('main');