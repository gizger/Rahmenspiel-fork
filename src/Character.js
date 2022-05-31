import Phaser from "phaser";

export default class Character extends Phaser.GameObjects.Sprite{

    constructor(scene, x, y, character) {
        super(scene, x, y, character);
        this.selectedCharacter=character;
        this.keyboard=this.scene.input.keyboard;
        this.cursors = this.keyboard.createCursorKeys();
        this.keyW = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this).setScale(0.1875);
        this.body.setCollideWorldBounds(true);
        this.createAnimations();
    }

    move() {
        if (this.cursors.up.isDown || this.keyW.isDown) {
            if (this.scene.oSpeechBubble.visible) {
                this.scene.oSpeechBubble.scaleDownDestroy(100);
                this.scene.oHelpArrow.setVisible(false);
            }
            this.body.setVelocityY(-200);
            this.body.setVelocityX(0);
            this.anims.play('up', true);
        }
        else if (this.cursors.left.isDown || this.keyA.isDown) {
            if (this.scene.oSpeechBubble.visible) {
                this.scene.oSpeechBubble.scaleDownDestroy(100);
                this.scene.oHelpArrow.setVisible(false);
            }
            this.body.setVelocityX(-200);
            this.body.setVelocityY(0);
            this.anims.play('left', true);
        }
        else if (this.cursors.down.isDown || this.keyS.isDown) {
            if (this.scene.oSpeechBubble.visible) {
                this.scene.oSpeechBubble.scaleDownDestroy(100);
                this.scene.oHelpArrow.setVisible(false);
            }
            this.body.setVelocityY(200);
            this.body.setVelocityX(0);
            this.anims.play('down', true);
        }
        else if (this.cursors.right.isDown || this.keyD.isDown) {
            if (this.scene.oSpeechBubble.visible) {
                this.scene.oSpeechBubble.scaleDownDestroy(100);
                this.scene.oHelpArrow.setVisible(false);
            }
            this.body.setVelocityX(200);
            this.body.setVelocityY(0);
            this.anims.play('right', true);
        }
        else{
            this.anims.play('idle', true);
            this.body.setVelocity(0,0);
        }
    }

   createAnimations(){
       this.scene.anims.create({
           key: 'up',
           frames: this.scene.anims.generateFrameNumbers(this.selectedCharacter, {start: 24, end: 27}),
           frameRate: 8
       });
       this.scene.anims.create({
           key: 'left',
           frames: this.scene.anims.generateFrameNumbers(this.selectedCharacter, {start: 10, end: 13}),
           frameRate: 8
       });
       this.scene.anims.create({
           key: 'down',
           frames: this.scene.anims.generateFrameNumbers(this.selectedCharacter, {start: 3, end: 6}),
           frameRate: 8
       });
       this.scene.anims.create({
           key: 'right',
           frames: this.scene.anims.generateFrameNumbers(this.selectedCharacter, {start: 17, end: 20}),
           frameRate: 8
       });
       this.scene.anims.create({
           key: 'idle',
           frames: this.scene.anims.generateFrameNumbers(this.selectedCharacter, {start: 0, end: 3}),
           frameRate: 8
       });
   }

}