import Phaser from "phaser";
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import LoginScene from "./scenes/LoginScene";
import RegisterScene from "./scenes/RegisterScene";
import CharacterSelectionScene from "./scenes/CharacterSelectionScene";
import StartScene from "./scenes/StartScene";

const config = {
    type: Phaser.AUTO,
    scale: {
        parent: "game_div",
        mode: Phaser.Scale.AUTO,
        width: 1920,
        height: 937
    },
    physics: {
        default: "arcade"
    },
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI'
        }]
    },
    dom: {
        createContainer: true,
    },
    scene: [LoginScene, RegisterScene, CharacterSelectionScene, StartScene],
};

const game = new Phaser.Game(config);