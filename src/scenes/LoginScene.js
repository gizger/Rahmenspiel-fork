import Phaser from "phaser";

export default class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: "LoginScene" });
    }

    init(data){
        this.sRegisteredMessage = data.sRegisteredMessage;
    }

    preload() {
        this.load.html("loginForm", "/forms/loginform.html");
        this.load.spritesheet("background", "/assets/background.png", {
            frameHeight: 973,
            frameWidth: 1920
        });
    }

    create() {
        this.anims.create({
            key: "backgroundImage",
            frames: this.anims.generateFrameNumbers("background", {
                start: 0,
                end: 17
            }),
            frameRate: 5,
            repeat: 0
        });

        this.background = this.add.sprite(0, 0, "background").setOrigin(0, 0);

        const oElement = this.add.dom(this.game.canvas.width / 2, this.game.canvas.height / 2).createFromCache("loginForm");
        oElement.alpha = 0;

        oElement.addListener("click");

        oElement.on("click", function (event) {
            if (event.target.name === "loginButton") {
                const sInputUsername = oElement.getChildByName("email").value;
                const sInputPassword = oElement.getChildByName("password").value;

                const data = { email: sInputUsername, password: sInputPassword };

                if (sInputUsername !== "" && sInputPassword !== "") {

                    fetch("http://localhost:3000/api/v1/user/userLogin", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    })
                        .then((response) => {
                            if (response.status !== 200) {
                                console.log('There was a problem. Status Code: ' + response.status);
                                const oErrorToast = this.rexUI.add.toast({
                                    x: 960,
                                    y: 700,

                                    background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0xff3333),
                                    text: this.add.text(0, 0, '', {
                                        fontSize: '24px'
                                    }),
                                    space: {
                                        left: 20,
                                        right: 20,
                                        top: 20,
                                        bottom: 20,
                                    },

                                    duration: {
                                        in: 200,
                                        hold: 2000,
                                        out: 200,
                                    },
                                })
                                    .showMessage('Wrong Password/Username')
                                return;
                            }

                            response.json().then((data) => {
                                console.log(data);
                                this.scene.start("CharacterSelectionScene");
                                sessionStorage["jwtToken"]=data._jwtToken;
                            });
                        })
                        .catch((err) => {
                            console.log('Error :', err);
                        });
                }
            }
            if (event.target.name === "registerButton") {
                this.scene.start("RegisterScene");
            }
        }, this);

        this.tweens.add({
            targets: oElement,
            duration: 1000,
            alpha: 1
        });

        if(this.sRegisteredMessage!=null){
            this.rexUI.add.toast({
                x: this.game.canvas.width / 2,
                y: this.game.canvas.height / 1.45,
                background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 20, 0x008000),
                text: this.add.text(0, 0, '', {
                    fontSize: '24px'
                }),
                space: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20,
                },
                duration: {
                    in: 200,
                    hold: 2000,
                    out: 200,
                },
            }).showMessage(this.sRegisteredMessage);
        }
    }

    update() {
        this.background.anims.play("backgroundImage", true);
    }
}
