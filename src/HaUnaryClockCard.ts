import { html, css, LitElement, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';
import {choose} from 'lit/directives/choose.js';

console.info(
  `%c  Unary-Clock \n%c  Version 0 `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

export class HaUnaryClockCard extends LitElement {
  @property({ type: Number }) rectangleSize = 5;

  @property({ attribute: false }) config: Record<string, unknown> = {};

  private timer: number | null = null; // Timer ID for setInterval
  private lastSeenMinute: number | -1 = -1;
 
  constructor() {
    super();
    this.timer = null;
  }

  //this is called when the card is first initialized (added to DOM)
  public connectedCallback(): void {
    super.connectedCallback();
    this.startTimer();
    //this._startInterval();
  }

  //called when card is removed from DOM
  public disconnectedCallback(): void {
    //this._stopInterval();
    super.disconnectedCallback();
    this.stopTimer(); // Cleanup
  }

  //Currently no config necessary, so do nothing
  public setConfig(config: Record<string, unknown>): void {
    this.config = config;
  }

  private updateTimer(): void {
    console.log('Timer update');
    // Add actual time update logic here
    this.requestUpdate();
  }

  private startTimer(): void {
    console.log('Timer started');
    if (!this.timer) {
      this.timer = window.setInterval(() => {
        this.updateTimer();
      }, 1000);
    }
  }

  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  //This is called when the card is resized
  public getCardSize(): number {
    // The height of your card. Home Assistant uses this to automatically
    // distribute all cards over the available columns.
    // This is actually optional. If not present, the cardHeight is assumed to be 1.
    return 1;
  }

  private createRandomBooleanArray(size: number, trueCount: number): boolean[] {
    if (trueCount > size) {
      throw new Error('Cannot have more true then available');
    }

    // Initialize an array with all `false`
    const result: boolean[] = Array(size).fill(false);

    // Generate an array of unique random indices
    const trueIndices = new Set<number>();
    while (trueIndices.size < trueCount) {
      const randomIndex = Math.floor(Math.random() * size);
      trueIndices.add(randomIndex);
    }

    // Set the randomly chosen indices to `true`
    trueIndices.forEach(index => {
      result[index] = true;
    });

    return result;
  }

  private getHourElement(block: string, x: number, y: number, on: boolean): ReturnType<typeof html> {
    if (on) {
      return html`
        <div
          id="${block}_${x}_${y}"
          class="hour ${block} on"
          width="${this.rectangleSize}"
          height="${this.rectangleSize}"
        >
          <!--${x}_${y}-->
        </div>
      `;
    }
    else {
      return html`
        <div
          id="${block}_${x}_${y}"
          class="hour ${block} off"
          width="${this.rectangleSize}"
          height="${this.rectangleSize}"
        >
          <!--${x}_${y}-->
        </div>
      `;
    }
  }
  private getMinuteElement(block: string, x: number, y: number, on: boolean): ReturnType<typeof html> {
    if (on) {
      return html`
        <div
          id="${block}_${x}_${y}"
          class="minute ${block} on"
          width="${this.rectangleSize}"
          height="${this.rectangleSize}"
        >
          <!--${x}_${y}-->
        </div>
      `;
    }
    else {
      return html`
        <div
          id="${block}_${x}_${y}"
          class="minute ${block} off "
          width="${this.rectangleSize}"
          height="${this.rectangleSize}"
        >
          <!--${x}_${y}-->
        </div>
      `;
    }
  }


  private onOffHours1: boolean[] | [] = [];
  private onOffHours2: boolean[] | [] = [];

  renderHours(now: Date) {
    const hours = now.getHours();
    const firstDigit = Math.floor(hours / 10);
    const secondDigit = hours % 10;

    if (now.getMinutes() != this.lastSeenMinute) {
      this.onOffHours1 = this.createRandomBooleanArray(9, firstDigit);
      this.onOffHours2 = this.createRandomBooleanArray(9, secondDigit);
    }

    return html`
      <div class="hours">
          ${map(
            range(3),
            x => html`
              ${map(
                range(3),
                y => html`
                ${ this.getHourElement("hourone", x, y, this.onOffHours1[x * 3 + y]) }
                `,
              )}
            `,
          )}
        </div>
        <div class="hours">
          ${map(
            range(3),
            x => html`
              ${map(
                range(3),
                y => html`
                  ${ this.getHourElement("hourtwo", x, y, this.onOffHours2[x * 3 + y]) }
                `,
              )}
            `,
          )}
        </div>
    `;
  }


  private onOffMinutes1: boolean[] | [] = [];
  private onOffMinutes2: boolean[] | [] = [];

  renderMinutes(now: Date) {
    const minutes = now.getMinutes();
    const firstDigit = Math.floor(minutes / 10);
    const secondDigit = minutes % 10;

    if (now.getMinutes() != this.lastSeenMinute) {
      this.lastSeenMinute = now.getMinutes();
      console.log('New minute');
      this.onOffMinutes1 = this.createRandomBooleanArray(9, firstDigit);
      this.onOffMinutes2 = this.createRandomBooleanArray(9, secondDigit);
    }

    return html`
      <div class="minutes">
            ${map(
              range(3),
              x => html`
                ${map(
                  range(3),
                  y => html`
                     ${ this.getMinuteElement("minuteone", x, y, this.onOffMinutes1[x * 3 + y]) }
                  `,
                )}
              `,
            )}
          </div>
          <div class="minutes">
            ${map(
              range(3),
              x => html`
                ${map(
                  range(3),
                  y => html`
                     ${ this.getMinuteElement("minutetwo", x, y, this.onOffMinutes2[x * 3 + y]) }
                  `,
                )}
              `,
            )}
          </div>
      `;
  }

  render() {
    const now: Date = new Date();
    //this.renderHours(now);

    return html`
      <div class="clock">
        ${this.renderHours(now)}
        ${this.renderMinutes(now)} 
      </div>
    `;
  }

  static get styles(): CSSResult {
    return css`
      .clock {
        display: grid;
        background-color: slategray;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        width: 100vw;
        max-width: 100%;
        box-sizing: border-box;
        padding: 10px;
      }
      .hours,
      .minutes {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 90%;
        
        gap: 5px;
      }
      .hour,
      .minute {
        aspect-ratio: 1;
        width: 90%;
        margin: 5px;
      }

      .hour.hourone.on {
        background-color: red;
      }
      .hour.hourtwo.on {
        background-color: blue;
      }
      .minute.minuteone.on {
        background-color: purple;
      }
      .minute.minutetwo.on {
        background-color: green;
      }
      .hour.off,
      .minute.off {
        background-color: gray;
      }
    `;
  }
}

customElements.define('ha-unary-clock-card', HaUnaryClockCard);
