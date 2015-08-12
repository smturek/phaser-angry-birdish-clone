var Chicken = Chicken || {};

Chicken.game = new Phaser.Game(1080, 640, Phaser.AUTO);

Chicken.game.state.add('Boot', Chicken.BootState);
Chicken.game.state.add('Preload', Chicken.PreloadState);
Chicken.game.state.add('Game', Chicken.GameState);

Chicken.game.state.start('Boot');
