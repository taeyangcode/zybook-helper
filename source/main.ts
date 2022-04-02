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

  public static getRadioButtons(): NodeListOf<HTMLInputElement> {
    return document.querySelectorAll("input[type=radio]");
  }

  public static getParticipateStartButtons(): HTMLCollectionOf<HTMLButtonElement> {
    return document.getElementsByClassName("zb-button primary raised start-button start-graphic") as HTMLCollectionOf<HTMLButtonElement>;
  }

  public static get2XSpeedButtons(): NodeListOf<HTMLInputElement> {
    return document.querySelectorAll('input[aria-label="2x speed"]');
  }

  public static participateQuestionsExist(): boolean {
    return this.get2XSpeedButtons().length > 0;
  }

  public static getParticipatePlayButtons(): HTMLCollectionOf<HTMLDivElement> {
    return document.getElementsByClassName("play-button bounce") as HTMLCollectionOf<HTMLDivElement>;
  }

  public static getParticipateFinishButtons(): HTMLCollectionOf<HTMLDivElement> {
    return document.getElementsByClassName("play-button rotate-180") as HTMLCollectionOf<HTMLDivElement>;
  }

  // public static getOutputSolverStartButton(): HTMLCollectionOf<HTMLButtonElement> {
  //   return document.getElementsByClassName("zyante-progression-start-button button") as HTMLCollectionOf<HTMLButtonElement>;
  // }
}

class Solver {
  public static solveMultipleChoice(): void {
    setTimeout(() => {
      const radioButtons: NodeListOf<HTMLInputElement> = Zybook.getRadioButtons();

      radioButtons.forEach((radioButton: HTMLInputElement, index: number) => {
        setTimeout(() => radioButton.click(), index * 300);
      });
    }, 3000);
  }

  public static solveTextAreas(): void {
    const showAnswerButtons: HTMLCollectionOf<HTMLButtonElement> = Zybook.getShowAnswerButtons();
    const forfeitAnswers: HTMLCollectionOf<HTMLSpanElement> = Zybook.getForfeitAnswers();
    const textAreas: HTMLCollectionOf<HTMLTextAreaElement> = Zybook.getDefaultTextAreas();
    const checkButtons: HTMLCollectionOf<HTMLButtonElement> = Zybook.getCheckButtons();

    setTimeout(() => Zybook.clickButtons(showAnswerButtons), 1500);
    setTimeout(() => Zybook.clickButtons(showAnswerButtons), 2000);

    setTimeout(() => {
      [...textAreas].forEach((textArea: HTMLTextAreaElement, index: number) => {
        textArea.value = [...forfeitAnswers][index].textContent!;
        textArea.focus();
        textArea.blur();
        [...checkButtons][index].click();
      });
    }, 2500);
  }

  private static enable2XSpeed(speedButtons: NodeListOf<HTMLInputElement>): void {
    speedButtons.forEach((button: HTMLInputElement) => {
      button.click();
    });
  }

  private static pause = (time: number) => new Promise((resolve: TimerHandler) => setTimeout(resolve, time));

  private static async completeParticipateActivity(activityAmount: number): Promise<void> {
    let finishButtons: HTMLCollectionOf<HTMLDivElement> = Zybook.getParticipateFinishButtons();

    // Run loop while the amount of finish buttons on the screen is less than the amount
    // of participation activities for this page.
    while (finishButtons.length < activityAmount) {
      const playButtons: HTMLCollectionOf<HTMLDivElement> = Zybook.getParticipatePlayButtons();
      [...playButtons].forEach((playButton: HTMLDivElement) => {
        playButton.click();
      });

      // Update finishButtons with the (new) amount of finish buttons on the page
      finishButtons = Zybook.getParticipateFinishButtons();

      // To prevent locking, loop pauses for 1 second before continuing onto next iteration
      await this.pause(1000);
    }
  }

  public static solveParticipateQuestions(): void {
    setTimeout(() => {
      // If there are no participate questions, exit function
      if (!Zybook.participateQuestionsExist()) {
        return;
      }

      const startButtons: HTMLCollectionOf<HTMLButtonElement> = Zybook.getParticipateStartButtons();
      const speedButtons: NodeListOf<HTMLInputElement> = Zybook.get2XSpeedButtons();
      const activityAmount: number = speedButtons.length;
      this.enable2XSpeed(speedButtons);

      // Click start button for each participation activity
      [...startButtons].forEach((startButton: HTMLButtonElement, index: number) => {
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

Solver.solveMultipleChoice();
Solver.solveTextAreas();
Solver.solveParticipateQuestions();
