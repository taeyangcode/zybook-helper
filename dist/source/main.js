"use strict";
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
}
function solve() {
    const showAnswerButtons = Zybook.getShowAnswerButtons();
    const forfeitAnswers = Zybook.getForfeitAnswers();
    const textAreas = Zybook.getDefaultTextAreas();
    const checkButtons = Zybook.getCheckButtons();
    setTimeout(() => Zybook.clickButtons(showAnswerButtons), 2000);
    setTimeout(() => Zybook.clickButtons(showAnswerButtons), 3000);
    setTimeout(() => {
        [...textAreas].forEach((textArea, index) => {
            textArea.value = [...forfeitAnswers][index].textContent;
            textArea.focus();
            textArea.blur();
            setTimeout(() => [...checkButtons][index].click(), 2000);
        });
    }, 4000);
}
solve();
