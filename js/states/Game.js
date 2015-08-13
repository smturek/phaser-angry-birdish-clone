var Chicken = Chicken || {};

Chicken.GameState = {
    init: function(currentLevel) {
        this.MAX_DISTANCE_SHOT = 190;
        this.MAX_SPEED_SHOT = 1000;
        this.SHOOT_FACTOR = 12;
        this.KILL_DIFF = 25;

        //keep track of current level
        this.currentLevel = currentLevel ? currentLevel : 'level1';

        //gravity
        this.game.physics.p2.gravity.y = 1000;

        //collision groups
        this.blocksCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.enemiesCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.chickensCollisionGroup = this.game.physics.p2.createCollisionGroup();

    },
    create: function() {

        //sky background
        this.sky = this.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'sky', 0);
        this.game.world.sendToBack(this.sky);

        //enemies
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.P2JS;

        //blocks
        this.blocks = this.add.group();
        this.blocks.enableBody = true;
        this.blocks.physicsBodyType = Phaser.Physics.P2JS;

        this.floor = this.add.tileSprite(this.game.world.width/2, this.game.world.height - 24, this.game.world.width, 48, 'floor');
        this.blocks.add(this.floor);

        this.floor.body.setCollisionGroup(this.blocksCollisionGroup);
        this.floor.body.collides([this.blocksCollisionGroup, this.enemiesCollisionGroup, this.chickensCollisionGroup]);
        this.floor.body.static = true;

        //load level information
        this.loadLevel();

        this.enemy = this.add.sprite(100, 100, 'pig');
        this.enemies.add(this.enemy);

        this.enemy.body.setCollisionGroup(this.enemiesCollisionGroup);
        this.enemy.body.collides([this.blocksCollisionGroup, this.enemiesCollisionGroup, this.chickensCollisionGroup]);

        this.enemy.body.onBeginContact.add(this.hitEnemy, this.enemy);

    },
    update: function() {

    },
    gameOver: function() {
        this.game.state.start('Game', true, false, this.currentLevel);
    },
    loadLevel: function() {
        this.levelData = JSON.parse(this.game.cache.getText(this.currentLevel));

        //create all the blocks
        this.levelData.blocks.forEach(function(block) {
            this.createBlock(block);
        }, this);
    },
    createBlock: function(data) {
        var block = new Phaser.Sprite(this.game, data.x, data.y, data.asset);
        this.blocks.add(block);

        //set mass
        block.body.mass = data.mass;

        //set the collision group
        block.body.setCollisionGroup(this.blocksCollisionGroup);

        //they will collide with
        block.body.collides([this.blocksCollisionGroup, this.enemiesCollisionGroup, this.chickensCollisionGroup]);

        return block;
    },
    hitEnemy: function(bodyB, shapeA, shapeB, shapeC, equation) {
        var velocityDiff = Phaser.Point.distance(
            new Phaser.Point(equation[0].bodyA.velocity[0], equation[0].bodyA.velocity[1]),
            new Phaser.Point(equation[0].bodyB.velocity[0], equation[0].bodyB.velocity[1])
        );

        if(velocityDiff > Chicken.GameState.KILL_DIFF) {
            this.kill();
        }
    }
};
