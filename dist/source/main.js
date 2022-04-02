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
class ZybookHelper {
    static clickButtons(buttons) {
        [...buttons].forEach((button) => {
            button.click();
        });
    }
}
class TextArea {
    static getShowAnswerButtons() {
        return document.getElementsByClassName("zb-button secondary show-answer-button");
    }
    static getForfeitAnswers() {
        return document.getElementsByClassName("forfeit-answer");
    }
    static getDefaultTextAreas() {
        return document.getElementsByClassName("ember-text-area ember-view zb-text-area hide-scrollbar");
    }
    static getCheckButtons() {
        return document.getElementsByClassName("zb-button primary raised check-button");
    }
    static inputTextAreas(textAreas, input) {
        if (textAreas.length !== input.length) {
            throw new RangeError("Text Area collection and Input collection mismatch in length!");
        }
        [...textAreas].forEach((textArea, index) => {
            textArea.value = input[index];
        });
    }
    static solve() {
        const showAnswerButtons = TextArea.getShowAnswerButtons();
        const textAreas = TextArea.getDefaultTextAreas();
        const checkButtons = TextArea.getCheckButtons();
        // Delayed to wait for page to load Show Answer buttons
        setTimeout(() => ZybookHelper.clickButtons(showAnswerButtons), 1000);
        setTimeout(() => ZybookHelper.clickButtons(showAnswerButtons), 1500);
        setTimeout(() => {
            const forfeitAnswers = TextArea.getForfeitAnswers();
            [...textAreas].forEach((textArea, index) => {
                textArea.value = forfeitAnswers[index].textContent;
                // Without focusing textarea, submit button's
                // POST operation recognizes its value as empty.
                textArea.focus();
                textArea.blur();
                checkButtons[index].click();
            });
        }, 2000);
    }
}
class MultipleChoice {
    static getRadioButtons() {
        return document.querySelectorAll("input[type=radio]");
    }
    static solve() {
        setTimeout(() => {
            const radioButtons = MultipleChoice.getRadioButtons();
            // Iterating and clicking over each radio button before their respective
            // POST operation completes will end up in occassional unregistered clicks.
            radioButtons.forEach((radioButton, index) => {
                setTimeout(() => radioButton.click(), index * 300);
            });
        }, 3000);
    }
}
class Participate {
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
    static completeParticipateActivity(activityAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            let finishButtons = Participate.getParticipateFinishButtons();
            // Run loop while the amount of finish buttons on the screen is less than the amount
            // of participation activities for this page.
            while (finishButtons.length < activityAmount) {
                const playButtons = Participate.getParticipatePlayButtons();
                ZybookHelper.clickButtons(playButtons);
                // Update finishButtons with the (new) amount of finish buttons on the page
                finishButtons = Participate.getParticipateFinishButtons();
                // To prevent locking, loop pauses for 1 second before continuing onto next iteration
                yield this.pause(1000);
            }
        });
    }
    static solve() {
        setTimeout(() => {
            // If there are no participate questions, exit function
            if (!Participate.participateQuestionsExist()) {
                return;
            }
            const startButtons = Participate.getParticipateStartButtons();
            const speedButtons = Participate.get2XSpeedButtons();
            const activityAmount = speedButtons.length;
            // Click 2x speed buttons & start buttons
            ZybookHelper.clickButtons(speedButtons);
            ZybookHelper.clickButtons(startButtons);
            // Initiate completion method once required
            // starting buttons have been clicked.
            setTimeout(() => {
                this.completeParticipateActivity(activityAmount);
            }, 500);
        }, 3000);
    }
}
Participate.pause = (time) => new Promise((resolve) => setTimeout(resolve, time));
TextArea.solve();
MultipleChoice.solve();
Participate.solve();
