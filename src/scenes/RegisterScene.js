import Phaser from "phaser";

const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
export default class RegisterScene extends Phaser.Scene {
    constructor() {
        super({key: "RegisterScene"});
    }

    preload() {
        this.load.html("registerForm", "/forms/registerform.html");
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

        const oElement = this.add.dom(this.game.canvas.width / 2, this.game.canvas.height / 2).createFromCache("registerForm");
        const oPasswordPrerequisites = this.rexUI.add.textBox({
            background: this.rexUI.add.roundRectangle(this.game.canvas.width / 1.35, this.game.canvas.height / 2.05, 540, 90, 20, 0x008000),
            text: this.add.text(this.game.canvas.width / 1.65, this.game.canvas.height / 2.2, "Password must contain at least 8 characters including:\n" +
                "- 1 capital letter\n" +
                "- 1 number\n" +
                "- 1 special character"),
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },
        });
        oPasswordPrerequisites.visible=false;

        document.getElementById("email").onkeyup = function () {
            if (!emailRegex.test(document.getElementById("email").value)
                &&document.getElementById("email").value!=="") {
                document.getElementById("invalidEmail").style.visibility = "visible";
            } else {
                document.getElementById("invalidEmail").style.visibility = "hidden";
            }
        }
        document.getElementById("password").onkeyup = function () {
            if (!passwordRegex.test(document.getElementById("password").value)
                &&document.getElementById("password").value!=="") {
                document.getElementById("invalidPassword").style.visibility = "visible";
            } else {
                document.getElementById("invalidPassword").style.visibility = "hidden";
            }
            if (document.getElementById("password").value !== document.getElementById("repeatPassword").value) {
                document.getElementById("invalidRepeatPassword").style.visibility = "visible";
            } else {
                document.getElementById("invalidRepeatPassword").style.visibility = "hidden";
            }
        }
        document.getElementById("password").onpointerover = () => {
            oPasswordPrerequisites.visible=true;
        }
        document.getElementById("password").onpointerleave = () => {
            oPasswordPrerequisites.visible=false;
        }
        document.getElementById("repeatPassword").onkeyup = function () {
            if (document.getElementById("password").value !== document.getElementById("repeatPassword").value) {
                document.getElementById("invalidRepeatPassword").style.visibility = "visible";
            } else {
                document.getElementById("invalidRepeatPassword").style.visibility = "hidden";
            }
        }
        
        oElement.alpha = 0;
        oElement.addListener("click");
        oElement.on("click", function (event) {
            if (event.target.name === "saveButton") {
                const sInputFirstName = oElement.getChildByName("firstName").value;
                const sInputLastName = oElement.getChildByName("lastName").value;
                const sInputEmail = oElement.getChildByName("email").value;
                const sInputPassword = oElement.getChildByName("password").value;
                const sInputRepeatPassword = oElement.getChildByName("repeatPassword").value;
                const data = {
                    firstName: sInputFirstName,
                    lastName: sInputLastName,
                    email: sInputEmail,
                    password: sInputPassword
                };
                const oErrorToast = this.rexUI.add.toast({
                    x: this.game.canvas.width/2,
                    y: this.game.canvas.height/1.2,
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
                });

                if (sInputFirstName !== ""
                    && sInputLastName !== ""
                    && sInputEmail !== ""
                    && sInputPassword !== ""
                    && sInputRepeatPassword !== "") {
                    fetch("http://localhost:3000/api/v1/user/create", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                    })
                        .then((response) => {
                            if (!emailRegex.test(sInputEmail)
                                || !passwordRegex.test(sInputPassword)
                                || sInputPassword !== sInputRepeatPassword) {
                                return;
                            }
                            if (response.status !== 200) {
                                oErrorToast.showMessage("Email already exist");
                                return;
                            }
                            response.json().then((data) => {
                                console.log(data);
                                this.scene.start("LoginScene", {
                                    sRegisteredMessage: "Succesfully registered"
                                });
                            });
                        })
                        .catch((err) => {
                            console.log('Error :', err);
                        });
                } else {
                    oErrorToast.showMessage("All fields are mandatory");
                }
            }
            if (event.target.name === "loginButton") {
                this.scene.start("LoginScene");
            }
        }, this);

        this.tweens.add({
            targets: oElement,
            duration: 1000,
            alpha: 1
        });
    }

    update() {
        this.background.anims.play("backgroundImage", true);
    }
}
