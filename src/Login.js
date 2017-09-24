"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bot;
var token;
function injectBot(injectedBot, tokenIn) {
    token = tokenIn;
    bot = injectedBot;
    bot.on("disconnect", waitThenLogin);
    bot.on("WaitAttempt", waitThenLogin);
    bot.on("attemptLogin", attemptLogin);
    attemptLogin();
}
exports.injectBot = injectBot;
function attemptLogin() {
    console.log("attempting login");
    bot.login(token).catch((err) => {
        console.log("Login Failed");
        console.log(err);
    });
    setTimeout(() => {
        if (bot.status == 5 || bot.status == 3) {
            console.log("login attempt timed out");
            console.log("Status: " + bot.status);
            bot.emit("attemptLogin");
        }
        else if (bot.status != 0) {
            console.log('Status: ' + bot.status + '\nStill waiting');
            bot.emit("WaitAttempt");
        }
        else {
            console.log("login successful");
        }
    }, 10000);
}
function waitThenLogin() {
    setTimeout(() => {
        if (bot.status == 5 || bot.status == 3) {
            console.log("Waited, status: " + bot.status);
            attemptLogin();
        }
        else if (bot.status != 0) {
            console.log('Status: ' + bot.status + '\nStill waiting');
            bot.emit("WaitAttempt");
        }
    }, 10000);
}
