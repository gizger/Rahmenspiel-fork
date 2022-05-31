import Phaser from "phaser";

const aCharacters = [];
let oSpriteMale1;
let oSpriteMale2;
let oSpriteMale3;
let oSpriteFemale1;
let oSpriteFemale2;
let oSpriteFemale3;

export default class CharacterSelectionScene extends Phaser.Scene {
    constructor() {
        super({ key: "CharacterSelectionScene" });
    }

    preload() {
        this.load.spritesheet("MaleSprite1", "/assets/characters/MaleSprite1.png", {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet("MaleSprite2", "/assets/characters/MaleSprite2.png", {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet("MaleSprite3", "/assets/characters/MaleSprite3.png", {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet("FemaleSprite1", "/assets/characters/FemaleSprite1.png", {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet("FemaleSprite2", "/assets/characters/FemaleSprite2.png", {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet("FemaleSprite3", "/assets/characters/FemaleSprite3.png", {frameWidth: 256, frameHeight: 256});
    }

    create() {
        this.add.text(this.game.canvas.width / 2, 50,  "Choose your character" , { fontSize: 32, color: "#d6d6d6"}).setOrigin(0.5);
        oSpriteMale1 = this.add.image(this.game.canvas.width / 4, this.game.canvas.height / 4, "MaleSprite1");
        oSpriteMale2 = this.add.image(this.game.canvas.width / 2, this.game.canvas.height / 4, "MaleSprite2");
        oSpriteMale3 = this.add.image(this.game.canvas.width - this.game.canvas.width / 4, this.game.canvas.height / 4, "MaleSprite3");
        oSpriteFemale1 = this.add.image(this.game.canvas.width / 4, this.game.canvas.height - this.game.canvas.height / 4, "FemaleSprite1");
        oSpriteFemale2 = this.add.image(this.game.canvas.width / 2, this.game.canvas.height - this.game.canvas.height / 4, "FemaleSprite2");
        oSpriteFemale3 = this.add.image(this.game.canvas.width - this.game.canvas.width / 4, this.game.canvas.height - this.game.canvas.height / 4, "FemaleSprite3");

        aCharacters.push(oSpriteMale1, oSpriteMale2, oSpriteMale3, oSpriteFemale1, oSpriteFemale2, oSpriteFemale3);
        aCharacters.forEach(character => {
            character.setInteractive();
            //character.input.alwaysEnabled = true;
            character.setAlpha(0.5);

            character.on("pointerover", function () {
                this.setAlpha(1);
                this.displayHeight = 300;
                this.displayWidth = 300;
            });

            character.on("pointerout", function () {
                this.setAlpha(0.5);
                this.displayHeight = 256;
                this.displayWidth = 256;
            });

            const oScene = this;

            character.on("pointerdown", function () {
                const x = oScene.game.canvas.width / 2, y = oScene.game.canvas.height / 2;
                createDialog(oScene, x, y, this.texture.key);
            });
        })
    }
}

const createDialog = (oScene, x, y, sSelectedKey) => {
    let oDialog = oScene.rexUI.add.dialog({
        x: x,
        y: y,

        background: oScene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

        content: oScene.add.text(0, 0, 'Are you sure about that?', {
            fontSize: '24px'
        }),

        actions: [],

        space: {
            title: 25,
            content: 25,
            action: 15,

            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
        },

        align: {
            actions: 'right',
        },

        expand: {
            content: false, // Content is a pure text object
        }
    })
        .addAction([
            createLabel(oScene, 'Yes'),
            createLabel(oScene, 'No')
        ]) 
        .layout();

        oDialog
        .on('button.click', function (oButton) {
            if (oButton.text === "Yes") {
                oScene.scene.start("StartScene", { selectedKey: sSelectedKey});
            } else {
                oDialog.scaleDownDestroy(100);

                aCharacters.forEach(character => {
                    character.setInteractive();
                });
            }
        })
        .on('button.over', function (oButton) {
            oButton.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (oButton) {
            oButton.getElement('background').setStrokeStyle();
        });

    aCharacters.forEach(character => {
        character.disableInteractive();
    });

    return oDialog;
}

const createLabel = (oScene, sText) => {
    return oScene.rexUI.add.label({

        background: oScene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x5e92f3),

        text: oScene.add.text(0, 0, sText, {
            fontSize: '24px'
        }),

        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
}