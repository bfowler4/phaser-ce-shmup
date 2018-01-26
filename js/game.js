(Phaser => {
  const GAME_WIDTH = 460;
  const GAME_HEIGHT = 600;
  const GAME_CONTAINER_ID = `game`;
  const GFX = `gfx`;
  const INITIAL_MOVESPEED = 4;

  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });

  let player;
  let cursors;
  // Core game methods
  function preload() {
    game.load.spritesheet(GFX, `../assets/shmup-spritesheet-140x56-28x28-tile.png`, 28, 28);
  }

  function create() {
    cursors = game.input.keyboard.createCursorKeys();
    player = game.add.sprite(100, 100, GFX, 8);
    player.moveSpeed = INITIAL_MOVESPEED;
  }

  function update() {
    handlePlayerMovement();
  }

  //handler function
  function handlePlayerMovement() {
    switch( true ){
      case cursors.left.isDown:
        player.x -= player.moveSpeed;
        break;
      case cursors.right.isDown:
        player.x += player.moveSpeed;
        break;
    }
    switch( true ){
      case cursors.down.isDown:
        player.y += player.moveSpeed;
        break;
      case cursors.up.isDown:
        player.y -= player.moveSpeed;
        break;
    }
  };

})(window.Phaser);