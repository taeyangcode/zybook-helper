"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
debugger;
const isUndefined = (input) => typeof input === "undefined";
class Zybook {
    static getShowAnswerButtons() {
        return document.getElementsByClassName("zb-button secondary show-answer-button");
    }
    static clickButtons(buttons) {
        [...buttons].forEach((button) => {
            button.click();
        });
    }
    static getForfeitAnswers() {
        return document.getElementsByClassName("forfeit-answer");
    }
    static getDefaultTextAreas() {
        return document.getElementsByClassName("ember-text-area ember-view zb-text-area hide-scrollbar");
    }
    static inputTextAreas(textAreas, input) {
        if (textAreas.length !== input.length) {
            throw new RangeError("Text Area collection and Input collection mismatch in length!");
        }
        [...textAreas].forEach((textArea, index) => {
            textArea.value = input[index];
        });
    }
    static getCheckButtons() {
        return document.getElementsByClassName("zb-button primary raised check-button");
    }
    static getRadioButtons() {
        return document.querySelectorAll("input[type=radio]");
    }
    static getParticipateStartButtons() {
        return document.getElementsByClassName("zb-button primary raised start-button start-graphic");
    }
    static get2XSpeedButtons() {
        return document.querySelectorAll('input[aria-label="2x speed"]');
    }
    static participateQuestionsExist() {
        return this.get2XSpeedButtons().length > 0;
    }
    static getParticipatePlayButtons() {
        return document.getElementsByClassName("play-button bounce");
    }
    static getParticipateFinishButtons() {
        return document.getElementsByClassName("play-button rotate-180");
    }
}
class Solver {
    static solveMultipleChoice() {
        setTimeout(() => {
            const radioButtons = Zybook.getRadioButtons();
            radioButtons.forEach((radioButton, index) => {
                setTimeout(() => radioButton.click(), index * 300);
            });
        }, 3000);
    }
    static solveTextAreas() {
        const showAnswerButtons = Zybook.getShowAnswerButtons();
        const forfeitAnswers = Zybook.getForfeitAnswers();
        const textAreas = Zybook.getDefaultTextAreas();
        const checkButtons = Zybook.getCheckButtons();
        setTimeout(() => Zybook.clickButtons(showAnswerButtons), 1500);
        setTimeout(() => Zybook.clickButtons(showAnswerButtons), 2000);
        setTimeout(() => {
            [...textAreas].forEach((textArea, index) => {
                textArea.value = [...forfeitAnswers][index].textContent;
                textArea.focus();
                textArea.blur();
                [...checkButtons][index].click();
            });
        }, 2500);
    }
    static enable2XSpeed(speedButtons) {
        speedButtons.forEach((button) => {
            button.click();
        });
    }
    static completeParticipateActivity(activityAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            let finishButtons = Zybook.getParticipateFinishButtons();
            // Run loop while the amount of finish buttons on the screen is less than the amount
            // of participation activities for this page.
            while (finishButtons.length < activityAmount) {
                const playButtons = Zybook.getParticipatePlayButtons();
                [...playButtons].forEach((playButton) => {
                    playButton.click();
                });
                // Update finishButtons with the (new) amount of finish buttons on the page
                finishButtons = Zybook.getParticipateFinishButtons();
                // To prevent locking, loop pauses for 1 second before continuing onto next iteration
                yield this.pause(1000);
            }
        });
    }
    static solveParticipateQuestions() {
        setTimeout(() => {
            // If there are no participate questions, exit function
            if (!Zybook.participateQuestionsExist()) {
                return;
            }
            const startButtons = Zybook.getParticipateStartButtons();
            const speedButtons = Zybook.get2XSpeedButtons();
            const activityAmount = speedButtons.length;
            this.enable2XSpeed(speedButtons);
            // Click start button for each participation activity
            [...startButtons].forEach((startButton, index) => {
                // To avoid issue where click event is sometimes
                // skipped when looping over HTML elements too fast,
                // each click is separated by 300 ms.
                setTimeout(() => {
                    startButton.click();
                }, 300 * index);
            });
            // Initiate the completion of each activity after
            // each activity has been started.
            // (hence the + 100ms)
            setTimeout(() => {
                this.completeParticipateActivity(activityAmount);
            }, 300 * startButtons.length + 100);
        }, 3000);
    }
}
Solver.pause = (time) => new Promise((resolve) => setTimeout(resolve, time));
Solver.solveMultipleChoice();
Solver.solveTextAreas();
Solver.solveParticipateQuestions();
