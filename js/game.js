(Phaser => {
  const GAME_WIDTH = 460;
  const GAME_HEIGHT = 600;
  const GAME_CONTAINER_ID = `game`;
  const GFX = `gfx`;
  const INITIAL_MOVESPEED = 4;
  const SQRT_TWO = Math.sqrt(2);
  const PLAYER_BULLET_SPEED = 6;
  const ENEMY_SPAWN_FREQ = 50; // higher is less frequent
  const ENEMY_SPEED = 4.5;

  const randomGenerator = new Phaser.RandomDataGenerator();

  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });

  let player;
  let cursors;
  let playerBullets;
  let enemies;
  // Core game methods
  function preload() {
    game.load.spritesheet(GFX, `../assets/shmup-spritesheet-140x56-28x28-tile.png`, 28, 28);
  }

  function create() {
    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add(handlePlayerFire);

    player = game.add.sprite(100, 100, GFX, 8);
    player.moveSpeed = INITIAL_MOVESPEED;
    playerBullets = game.add.group();
    enemies = game.add.group();
  }

  function update() {
    handlePlayerMovement();
    handleBulletAnimations();
    randomlySpawnEnemy();
    handleEnemyActions();
    handleCollisions();

    cleanup();
  }

  //handler function
  function handlePlayerMovement() {
    let movingH = SQRT_TWO;
    let movingV = SQRT_TWO;

    if (cursors.up.isDown || cursors.down.isDown) {
      movingH = 1; // slow down diagonal movement
    }
    if (cursors.left.isDown || cursors.right.isDown) {
      movingV = 1; // slow down diagonal movement
    }
    switch (true) {
      case cursors.left.isDown:
        player.x -= player.moveSpeed * movingH;
        break;
      case cursors.right.isDown:
        player.x += player.moveSpeed * movingH;
        break;
    }
    switch (true) {
      case cursors.down.isDown:
        player.y += player.moveSpeed * movingH;
        break;
      case cursors.up.isDown:
        player.y -= player.moveSpeed * movingH;
        break;
    }
  };

  function handlePlayerFire() {
    playerBullets.add(game.add.sprite(player.x, player.y, GFX, 7));
  }

  function handleBulletAnimations() {
    playerBullets.children.forEach(bullet => bullet.y -= PLAYER_BULLET_SPEED);
  }

  function handleEnemyActions() {
    enemies.children.forEach(enemy => enemy.y += ENEMY_SPEED);
  };

  function handleCollisions() {
    enemies.children.filter((enemy) => {
      return enemy.alive;
    }).forEach((enemy) => {
      for (bullet of playerBullets.children) {
        if (bullet.overlap(enemy)) {
          destroyEnemy(enemy);
          removeBullet(bullet);
          break;
        }
      }
    });

    let enemiesHit = enemies.children
      .filter(enemy => enemy.overlap(player));

    if (enemiesHit.length) {
      handlePlayerHit();

      enemiesHit.forEach(destroyEnemy);
    }
  };

  function handlePlayerHit() {
    gameOver();
  }

  // Behavioral functions
  function randomlySpawnEnemy() {
    if (randomGenerator.between(0, ENEMY_SPAWN_FREQ) === 0) {
      let randomX = randomGenerator.between(0, GAME_WIDTH);
      enemies.add(game.add.sprite(randomX, -24, GFX, 0));
    }
  }

  function gameOver() {
    game.state.destroy();
    game.add.text(90, 200, `YOUR HEAD ASPLODE`, { fill: '#FFFFFF' });
  }

  // Utlity functions
  function cleanup() {
    playerBullets.children
      .filter(bullet => bullet.y < -14)
      .forEach(bullet => bullet.destroy());
  }

  function removeBullet(bullet) {
    bullet.destroy();
  }

  function destroyEnemy(enemy) {
    enemy.kill();
  }

})(window.Phaser);