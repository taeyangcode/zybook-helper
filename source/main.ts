debugger;

class ZybookHelper {
  public static clickButtons(buttons: HTMLCollectionOf<HTMLElement> | NodeListOf<HTMLElement>): void {
    [...buttons].forEach((button: HTMLElement): void => {
      button.click();
    });
  }
}

class TextArea {
  public static getShowAnswerButtons(): HTMLCollectionOf<HTMLButtonElement> {
    return document.getElementsByClassName("zb-button secondary show-answer-button") as HTMLCollectionOf<HTMLButtonElement>;
  }

  public static getForfeitAnswers(): HTMLCollectionOf<HTMLSpanElement> {
    return document.getElementsByClassName("forfeit-answer") as HTMLCollectionOf<HTMLSpanElement>;
  }

  public static getDefaultTextAreas(): HTMLCollectionOf<HTMLTextAreaElement> {
    return document.getElementsByClassName(
      "ember-text-area ember-view zb-text-area hide-scrollbar"
    ) as HTMLCollectionOf<HTMLTextAreaElement>;
  }

  public static getCheckButtons(): HTMLCollectionOf<HTMLButtonElement> {
    return document.getElementsByClassName("zb-button primary raised check-button") as HTMLCollectionOf<HTMLButtonElement>;
  }

  public static inputTextAreas(textAreas: HTMLCollectionOf<HTMLTextAreaElement>, input: Array<string>): void {
    if (textAreas.length !== input.length) {
      throw new RangeError("Text Area collection and Input collection mismatch in length!");
    }
    [...textAreas].forEach((textArea: HTMLTextAreaElement, index: number): void => {
      textArea.value = input[index];
    });
  }

  public static solve(): void {
    const showAnswerButtons: HTMLCollectionOf<HTMLButtonElement> = this.getShowAnswerButtons();
    const textAreas: HTMLCollectionOf<HTMLTextAreaElement> = this.getDefaultTextAreas();
    const checkButtons: HTMLCollectionOf<HTMLButtonElement> = this.getCheckButtons();

    // Delayed to wait for page to load Show Answer buttons
    setTimeout((): void => ZybookHelper.clickButtons(showAnswerButtons), 1000);
    setTimeout((): void => ZybookHelper.clickButtons(showAnswerButtons), 1500);

    setTimeout((): void => {
      const forfeitAnswers: HTMLCollectionOf<HTMLSpanElement> = this.getForfeitAnswers();
      [...textAreas].forEach((textArea: HTMLTextAreaElement, index: number): void => {
        textArea.value = forfeitAnswers[index].textContent!;
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
  public static getRadioButtons(): NodeListOf<HTMLInputElement> {
    return document.querySelectorAll("input[type=radio]");
  }

  public static solve(): void {
    setTimeout((): void => {
      const radioButtons: NodeListOf<HTMLInputElement> = this.getRadioButtons();

      // Iterating and clicking over each radio button before their respective
      // POST operation completes will end up in occassional unregistered clicks.
      radioButtons.forEach((radioButton: HTMLInputElement, index: number): void => {
        setTimeout((): void => radioButton.click(), index * 300);
      });
    }, 3000);
  }
}

class Participate {
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

  private static pause = (time: number): Promise<unknown> => new Promise((resolve: TimerHandler): number => setTimeout(resolve, time));

  private static async completeParticipateActivity(activityAmount: number): Promise<void> {
    let finishButtons: HTMLCollectionOf<HTMLDivElement> = this.getParticipateFinishButtons();

    // Run loop while the amount of finish buttons on the screen is less than the amount
    // of participation activities for this page.
    while (finishButtons.length < activityAmount) {
      const playButtons: HTMLCollectionOf<HTMLDivElement> = this.getParticipatePlayButtons();
      ZybookHelper.clickButtons(playButtons);

      // Update finishButtons with the (new) amount of finish buttons on the page
      finishButtons = this.getParticipateFinishButtons();

      // To prevent locking, loop pauses for 1 second before continuing onto next iteration
      await this.pause(1000);
    }
  }

  public static solve(): void {
    setTimeout((): void => {
      // If there are no participate questions, exit function
      if (!this.participateQuestionsExist()) {
        return;
      }

      const startButtons: HTMLCollectionOf<HTMLButtonElement> = this.getParticipateStartButtons();
      const speedButtons: NodeListOf<HTMLInputElement> = this.get2XSpeedButtons();
      const activityAmount: number = speedButtons.length;

      // Click 2x speed buttons & start buttons
      ZybookHelper.clickButtons(speedButtons);
      ZybookHelper.clickButtons(startButtons);

      // Initiate completion method once required
      // starting buttons have been clicked.
      setTimeout((): void => {
        this.completeParticipateActivity(activityAmount);
      }, 500);
    }, 3000);
  }
}

class ErrorFind {
  public static getButtonOptions(): HTMLCollectionOf<HTMLButtonElement> {
    return document.getElementsByClassName("zb-button grey unclicked") as HTMLCollectionOf<HTMLButtonElement>;
  }

  public static solve(): void {
    setTimeout((): void => {
      const buttons: HTMLCollectionOf<HTMLButtonElement> = this.getButtonOptions();

      [...buttons].forEach((button: HTMLButtonElement, index: number): void => {
        setTimeout((): void => button.click(), index * 300);
      });
    }, 3000);
  }
}

interface OutputActivityElements {
  startButton: HTMLButtonElement;
  checkButton: HTMLButtonElement;
  nextButton: HTMLButtonElement;
  textArea: HTMLTextAreaElement;
}

class Output {
  private static getOutputActivies(): HTMLCollectionOf<HTMLDivElement> {
    return document.getElementsByClassName(
      "interactive-activity-container custom-content-resource challenge"
    ) as HTMLCollectionOf<HTMLDivElement>;
  }

  private static getStartButton(activity: HTMLDivElement): HTMLButtonElement {
    return activity.getElementsByClassName("zyante-progression-start-button button")[0] as HTMLButtonElement;
  }

  private static getCheckButton(activity: HTMLDivElement): HTMLButtonElement {
    return activity.getElementsByClassName("zyante-progression-check-button button")[0] as HTMLButtonElement;
  }

  private static getNextButton(activity: HTMLDivElement): HTMLButtonElement {
    return activity.getElementsByClassName("zyante-progression-next-button button")[0] as HTMLButtonElement;
  }

  private static getTextArea(activity: HTMLDivElement): HTMLTextAreaElement {
    return activity.querySelector('textarea[aria-label="The program\'s output"]')!;
  }

  private static getExpectedOutput(activity: HTMLDivElement): HTMLDivElement {
    return activity.getElementsByClassName("output expected-output")[0] as HTMLDivElement;
  }

  private static getActivityElements(activity: HTMLDivElement): OutputActivityElements {
    return {
      startButton: this.getStartButton(activity),
      checkButton: this.getCheckButton(activity),
      nextButton: this.getNextButton(activity),
      textArea: this.getTextArea(activity),
    };
  }

  public static solve(): void {
    setTimeout(() => {
      const activities: HTMLCollectionOf<HTMLDivElement> = this.getOutputActivies();

      [...activities].forEach((activity: HTMLDivElement) => {});
    }, 3000);
  }
}

// TextArea.solve();
// MultipleChoice.solve();
// Participate.solve();
// ErrorFind.solve();
Output.solve();
