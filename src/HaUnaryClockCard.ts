import { html, css, LitElement, CSSResult } from 'lit';
import { property } from 'lit/decorators.js';
import { range } from 'lit/directives/range.js';
import { map } from 'lit/directives/map.js';

console.info(
  `%c  Unary-Clock \n%c  Version 0 `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

export class HaUnaryClockCard extends LitElement {
  @property({ type: Number }) rectangleSize = 20;

  @property({ attribute: false }) config: Record<string, unknown> = {};

  private timer: number | null = null; // Timer ID for setInterval

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

  renderHours(now: Date) {
    const hours = now.getHours();
    const firstDigit = Math.floor(hours / 10);
    const secondDigit = hours % 10;

    const onOffHours1: boolean[] = this.createRandomBooleanArray(9, firstDigit);
    const onOffHours2: boolean[] = this.createRandomBooleanArray(9, secondDigit);
    //console.log(onOffHours);

    return html`
      <div class="hours">
          ${map(
            range(3),
            x => html`
              ${map(
                range(3),
                y => html`
                  <div
                    id="${x}_${y}"
                    class="hour"
                    width="${this.rectangleSize}"
                    height="${this.rectangleSize}"
                  >
                    ${x}_${y}
                  </div>
                `,
              )}
            `,
          )}
        </div>
    `;
  }

  renderMinutes(now: Date) {
    return html`
      <div class="minutes">
            ${map(
              range(3),
              x => html`
                ${map(
                  range(3),
                  y => html`
                    <div
                      id="${x}_${y}"
                      class="minute"
                      width="${this.rectangleSize}"
                      height="${this.rectangleSize}"
                    >
                      ${x}_${y}
                    </div>
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
      <h2>Unary Clock</h2>
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
        background-color: green;
        grid-template-columns: auto auto;
      }
      .hours,
      .minutes {
        display: grid;
        grid-template-columns: auto auto auto;
      }
      .hour,
      .minute {
        background-color: red;
        margin: 5px;
        height: 10vw;
        width: 10vw;
      }
    `;
  }
}

customElements.define('ha-unary-clock-card', HaUnaryClockCard);
