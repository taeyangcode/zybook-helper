debugger;

const isUndefined = (input: any): boolean => typeof input === "undefined";

class Zybook {
  public static getShowAnswerButtons(): HTMLCollectionOf<HTMLButtonElement> {
    return document.getElementsByClassName("zb-button secondary show-answer-button") as HTMLCollectionOf<HTMLButtonElement>;
  }

  public static clickButtons(buttons: HTMLCollectionOf<HTMLButtonElement>): void {
    [...buttons].forEach((button: HTMLButtonElement): void => {
      button.click();
    });
  }

  public static getForfeitAnswers(): HTMLCollectionOf<HTMLSpanElement> {
    return document.getElementsByClassName("forfeit-answer") as HTMLCollectionOf<HTMLSpanElement>;
  }

  public static getDefaultTextAreas(): HTMLCollectionOf<HTMLTextAreaElement> {
    return document.getElementsByClassName(
      "ember-text-area ember-view zb-text-area hide-scrollbar"
    ) as HTMLCollectionOf<HTMLTextAreaElement>;
  }

  public static inputTextAreas(textAreas: HTMLCollectionOf<HTMLTextAreaElement>, input: Array<string>): void {
    if (textAreas.length !== input.length) {
      throw new RangeError("Text Area collection and Input collection mismatch in length!");
    }
    [...textAreas].forEach((textArea: HTMLTextAreaElement, index: number): void => {
      textArea.value = input[index];
    });
  }

  public static getCheckButtons(): HTMLCollectionOf<HTMLButtonElement> {
    return document.getElementsByClassName("zb-button primary raised check-button") as HTMLCollectionOf<HTMLButtonElement>;
  }
}

function solve() {
  const showAnswerButtons: HTMLCollectionOf<HTMLButtonElement> = Zybook.getShowAnswerButtons();
  const forfeitAnswers: HTMLCollectionOf<HTMLSpanElement> = Zybook.getForfeitAnswers();
  const textAreas: HTMLCollectionOf<HTMLTextAreaElement> = Zybook.getDefaultTextAreas();
  const checkButtons: HTMLCollectionOf<HTMLButtonElement> = Zybook.getCheckButtons();

  setTimeout(() => Zybook.clickButtons(showAnswerButtons), 2000);
  setTimeout(() => Zybook.clickButtons(showAnswerButtons), 3000);

  setTimeout(() => {
    [...textAreas].forEach((textArea: HTMLTextAreaElement, index: number) => {
      textArea.value = [...forfeitAnswers][index].textContent!;
      textArea.focus();
      textArea.blur();
      setTimeout(() => [...checkButtons][index].click(), 2000);
    });
  }, 4000);
}

solve();
