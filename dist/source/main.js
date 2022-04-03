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
ZybookHelper.pause = (time) => new Promise((resolve) => setTimeout(resolve, time));
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
        const showAnswerButtons = this.getShowAnswerButtons();
        const textAreas = this.getDefaultTextAreas();
        const checkButtons = this.getCheckButtons();
        // Delayed to wait for page to load Show Answer buttons
        setTimeout(() => ZybookHelper.clickButtons(showAnswerButtons), 1000);
        setTimeout(() => ZybookHelper.clickButtons(showAnswerButtons), 1500);
        setTimeout(() => {
            const forfeitAnswers = this.getForfeitAnswers();
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
            const radioButtons = this.getRadioButtons();
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
            let finishButtons = this.getParticipateFinishButtons();
            // Run loop while the amount of finish buttons on the screen is less than the amount
            // of participation activities for this page.
            while (finishButtons.length < activityAmount) {
                const playButtons = this.getParticipatePlayButtons();
                ZybookHelper.clickButtons(playButtons);
                // Update finishButtons with the (new) amount of finish buttons on the page
                finishButtons = this.getParticipateFinishButtons();
                // To prevent locking, loop pauses for 1 second before continuing onto next iteration
                yield ZybookHelper.pause(1000);
            }
        });
    }
    static solve() {
        setTimeout(() => {
            // If there are no participate questions, exit function
            if (!this.participateQuestionsExist()) {
                return;
            }
            const startButtons = this.getParticipateStartButtons();
            const speedButtons = this.get2XSpeedButtons();
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
class ErrorFind {
    static getButtonOptions() {
        return document.getElementsByClassName("zb-button grey unclicked");
    }
    static solve() {
        setTimeout(() => {
            const buttons = this.getButtonOptions();
            [...buttons].forEach((button, index) => {
                setTimeout(() => button.click(), index * 300);
            });
        }, 3000);
    }
}
class Output {
    static getOutputActivies() {
        return document.getElementsByClassName("interactive-activity-container custom-content-resource challenge");
    }
    static getStartButton(activity) {
        return activity.getElementsByClassName("zyante-progression-start-button button")[0];
    }
    static getCheckButton(activity) {
        return activity.getElementsByClassName("zyante-progression-check-button button")[0];
    }
    static getNextButton(activity) {
        return activity.getElementsByClassName("zyante-progression-next-button button")[0];
    }
    static getTextArea(activity) {
        return activity.querySelector('textarea[aria-label="The program\'s output"]');
    }
    static getSpinner(activity) {
        return activity.getElementsByClassName("zyante-progression-spinner")[0];
    }
    static getExpectedOutput(activity) {
        return activity.getElementsByClassName("output expected-output")[0];
    }
    static getActivityElements(activity) {
        return {
            startButton: this.getStartButton(activity),
            checkButton: this.getCheckButton(activity),
            nextButton: this.getNextButton(activity),
            textArea: this.getTextArea(activity),
            spinner: this.getSpinner(activity),
        };
    }
    static checkButtonReady(button) {
        return __awaiter(this, void 0, void 0, function* () {
            while (button.classList.contains("disabled")) {
                yield ZybookHelper.pause(1000);
            }
            return;
        });
    }
    static spinnerActive(spinner) {
        return __awaiter(this, void 0, void 0, function* () {
            while (spinner.hasChildNodes()) {
                yield ZybookHelper.pause(1000);
            }
            return;
        });
    }
    static enableElement(element) {
        return __awaiter(this, void 0, void 0, function* () {
            element.removeAttribute("disabled");
            element.classList.remove("disabled");
        });
    }
    static isCompleted(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            while (activity.getElementsByClassName("zb-progress-circular med orange ember-view").length > 0) {
                yield ZybookHelper.pause(1000);
            }
            return activity.getElementsByClassName("zb-chevron title-bar-chevron grey outline large").length === 0;
        });
    }
    static exposeExpectedResult(checkButton) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkButtonReady(checkButton);
            checkButton.click();
            yield ZybookHelper.pause(500);
        });
    }
    static awaitExpectedResult(activity, spinner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.spinnerActive(spinner);
            return this.getExpectedOutput(activity).textContent;
        });
    }
    static inputAnswer(textArea, answer) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.enableElement(textArea);
            yield ZybookHelper.pause(500);
            textArea.focus();
            textArea.blur();
            textArea.value = answer;
        });
    }
    static submitAnswer(checkButton) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.enableElement(checkButton);
            yield ZybookHelper.pause(500);
            checkButton.click();
        });
    }
    static solveActivity(activity) {
        return __awaiter(this, void 0, void 0, function* () {
            const elements = this.getActivityElements(activity);
            yield ZybookHelper.pause(500);
            elements.startButton.click();
            while (!(yield this.isCompleted(activity))) {
                yield this.exposeExpectedResult(elements.checkButton);
                const answer = yield this.awaitExpectedResult(activity, elements.spinner);
                yield this.inputAnswer(elements.textArea, answer);
                yield this.submitAnswer(elements.checkButton);
                yield ZybookHelper.pause(1000).then(() => elements.nextButton.click());
            }
        });
    }
    static solve() {
        setTimeout(() => {
            const activities = this.getOutputActivies();
            [...activities].forEach((activity) => {
                this.solveActivity(activity);
            });
        }, 3000);
    }
}
TextArea.solve();
MultipleChoice.solve();
Participate.solve();
ErrorFind.solve();
Output.solve();
