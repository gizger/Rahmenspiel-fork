import Phaser from "phaser";
import Character from "../Character.js";

const sContent = 'How to Play\n\n- Press Arrow Keys or WASD to move around\n- Walk against Objects to interact\n- Interact with the Sign to get started';

export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: "StartScene" });
    }

    init(data)
	{
		this.selectedCharacter = data.selectedKey;
	}

    preload() {
        this.load.spritesheet(this.selectedCharacter, `/assets/characters/${this.selectedCharacter}.png`, {frameWidth: 256, frameHeight: 256});

        this.load.image("helpbutton", "/assets/misc/HelpButton.png");
        this.load.image("gameVillageTiles", "/assets/GameVillageTileSet.png");
        this.load.image("tavernTiles", "/assets/Tavern.png");
        this.load.image("signTiles", "/assets/Sign.png");
        this.load.tilemapTiledJSON('tilemap', '/assets/GameVillage.json');
        this.load.image("helpArrow", "/assets/misc/HelpArrow.png");
    }

    create() {
        this.oPlayer = new Character(this, this.game.canvas.width/3, this.game.canvas.height/1.75, this.selectedCharacter);
        this.oPlayer.setDepth(20);

        this.oSign = this.physics.add.image(192, 480, "signTiles").setImmovable(true);
        this.oSign.setDepth(15);
        this.oSign.setSize(10, 32, true);

        this.oHelpArrow = this.physics.add.image(192, 400, "helpArrow");
        this.oHelpArrow.setDepth(15);
        this.oHelpArrow.setVelocityY(60);
        this.oHelpArrow.setGravityY(160);
        this.oHelpArrow.setBounceY(1);

        this.oMap = this.make.tilemap({ key: 'tilemap' })

        this.oGameVillageTileset = this.oMap.addTilesetImage('VillageTileSet', 'gameVillageTiles', 32, 32, 1, 2);
        this.oTavernTileset = this.oMap.addTilesetImage("Tavern", "tavernTiles");
        this.oSignTileSet = this.oMap.addTilesetImage("Sign", "signTiles");

        this.groundLayer = this.oMap.createLayer('Ground', this.oGameVillageTileset);
        this.waterLayer = this.oMap.createLayer('Water', this.oGameVillageTileset);
        this.collisionLayer = this.oMap.createLayer('Collision', this.oGameVillageTileset);
        this.tavernLayer = this.oMap.createLayer("Tavern", this.oTavernTileset);
        this.tavernRoofLayer = this.oMap.createLayer("TavernRoof", this.oTavernTileset);

        this.tavernRoofLayer.setDepth(30);
        this.tavernLayer.setDepth(30);

        this.collisionLayer.setCollisionByExclusion([-1]);
        this.tavernLayer.setCollisionByExclusion([-1]);
        this.physics.add.collider(this.oPlayer, this.collisionLayer);
        this.physics.add.collider(this.oPlayer, this.tavernLayer);
        this.physics.add.collider(this.oPlayer, this.oSign, () => {
            this.oPlayer.y+=20;
            const x = this.game.canvas.width / 2, y = this.game.canvas.height / 2;
            createDialog(this, x, y).setDepth(40);
        });
        this.physics.add.collider(this.oHelpArrow, this.oSign);

        this.speechbuublex = this.oPlayer.x - 32;
        this.speechbuubley = this.oPlayer.y - 32;

        this.oSpeechBubble = createTextBox(this, this.speechbuublex, this.speechbuubley, {
            wrapWidth: 500,
        });
        this.oSpeechBubble.start(sContent, 50).setDepth(35);

        this.oHelpButton = this.add.image(1820, 100, "helpbutton");
        this.oHelpButton.setDepth(40).setInteractive();

        this.oHelpButton
        .on("pointerover", () => {
            this.oHelpButton.setScale(1.25);
        })
        .on("pointerout", () => {
            this.oHelpButton.setScale(1);
        })
        .on("pointerdown", () => {
            if (!this.oSpeechBubble.visible) {
                this.oSpeechBubble = createTextBox(this, this.oPlayer.x - 32, this.oPlayer.y -32, {
                    wrapWidth: 500,
                });
                this.oSpeechBubble.start(sContent, 50).setDepth(35);
                this.oHelpArrow.setVisible(true);
            }
        });
    }

    update() {
        this.oPlayer.move();
    }
}

const GetValue = Phaser.Utils.Objects.GetValue;
const createTextBox = (scene, x, y, config) => {
    const wrapWidth = GetValue(config, 'wrapWidth', 0);
    const fixedWidth = GetValue(config, 'fixedWidth', 0);
    const fixedHeight = GetValue(config, 'fixedHeight', 0);
    const textBox = scene.rexUI.add.textBox({
            x: x,
            y: y,

            background: CreateSpeechBubbleShape(scene, "0xebe4e4", "0x7b5e57"),

            text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),

        space: {
            left: 10, right: 10, top: 10, bottom: 25,
            icon: 10,
            text: 10,
        }
        })
        .setOrigin(0, 1)
        .layout();

    textBox
        .setInteractive()
        .on('pointerdown', function () {
            if (this.isTyping) {
                this.stop(true);
            } else {
                this.scaleDownDestroy(100);
                this.scene.oHelpArrow.setVisible(false);
            }
        }, textBox)

    return textBox;
}

const getBuiltInText = (scene, wrapWidth, fixedWidth, fixedHeight) => {
    return scene.add.text(0, 0, '', {
            fontSize: '20px',
            color: "#000000",
            wordWrap: {
                width: wrapWidth
            },
            maxLines: 5
        })
        .setFixedSize(fixedWidth, fixedHeight);
}

const CreateSpeechBubbleShape = (scene, fillColor, strokeColor) => {
    return scene.rexUI.add.customShapes({
        create: { lines: 1 },
        update: function () {
            const radius = 20;
            const indent = 15;

            const left = 0, right = this.width,
                top = 0, bottom = this.height, boxBottom = bottom - indent;
            this.getShapes()[0]
                .lineStyle(2, strokeColor, 1)
                .fillStyle(fillColor, 1)
                // top line, right arc
                .startAt(left + radius, top).lineTo(right - radius, top).arc(right - radius, top + radius, radius, 270, 360)
                // right line, bottom arc
                .lineTo(right, boxBottom - radius).arc(right - radius, boxBottom - radius, radius, 0, 90)
                // bottom indent                    
                .lineTo(left + 60, boxBottom).lineTo(left + 50, bottom).lineTo(left + 40, boxBottom)
                // bottom line, left arc
                .lineTo(left + radius, boxBottom).arc(left + radius, boxBottom - radius, radius, 90, 180)
                // left line, top arc
                .lineTo(left, top + radius).arc(left + radius, top + radius, radius, 180, 270)
                .close();

        }
    })
}

const createDialog = (oScene, x, y) => {
    let oDialog = oScene.rexUI.add.dialog({
        x: x,
        y: y,

        background: oScene.rexUI.add.roundRectangle(0, 0, 100, 100, 20, 0x1565c0),

        content: oScene.add.text(0, 0, 'Select an Subject to load mini games', {
            fontSize: '24px'
        }),

        choices: [
            createButton(oScene, "AEuP"),
            createButton(oScene, "Englisch"),
            createButton(oScene, "FPP"),
            createButton(oScene, "FU-BPr"),
            createButton(oScene, "FU-IT"),
            createButton(oScene, "PUG"),
            createButton(oScene, "Cancel")
        ],

        space: {
            title: 25,
            content: 25,
            choice: 15,

            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
        },

        expand: {
            content: false, // Content is a pure text object
        },
    })
        .layout();

    oDialog
        .on('button.click', function (oButton) {
        if (oButton.text=="Cancel") {
                oDialog.scaleDownDestroy(100);
            }
        if (oButton.text=="Englisch"){
            //start Subject Scene and load minigames for Englisch
        }
        })
        .on('button.over', function (oButton) {
            oButton.getElement('background').setStrokeStyle(1, 0xffffff);
        })
        .on('button.out', function (oButton) {
            oButton.getElement('background').setStrokeStyle();
        });

    return oDialog;
}

const createButton = (oScene, sText) => {
    return oScene.rexUI.add.label({

        background: oScene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x5e92f3),

        text: oScene.add.text(0, 0, sText, {
            fontSize: '24px'
        }),

        space: {
            left: 180,
            right: 10,
            top: 10,
            bottom: 10
        }
    })
}