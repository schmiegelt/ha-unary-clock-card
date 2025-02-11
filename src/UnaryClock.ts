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
  public setConfig(config: any): void {
    this.config = config;
  }

  private updateTimer(): void {
    // Add actual time update logic here
    const now: Date = new Date();
    if (now.getMinutes() != this.lastSeenMinute) {
      this.lastSeenMinute = now.getMinutes();
      this.requestUpdate();
    }
    else {
      //do nothing
    }
  }

  private startTimer(): void {
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

    
    this.onOffHours1 = this.createRandomBooleanArray(9, firstDigit);
    this.onOffHours2 = this.createRandomBooleanArray(9, secondDigit);
    
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

    
      
    this.onOffMinutes1 = this.createRandomBooleanArray(9, firstDigit);
    this.onOffMinutes2 = this.createRandomBooleanArray(9, secondDigit);
    

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
    
    //this.renderHours(now);
    const now: Date = new Date();

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
        background: var(--primary-background-color, #2c3e50);
        grid-template-columns: repeat(4, 1fr);
        gap: 5%;
        width: 100%;
        box-sizing: border-box;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 
          inset 0 2px 4px rgba(255,255,255,0.1),
          0 4px 8px rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.1);
      }
      .hours,
      .minutes {
        aspect-ratio: 1;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        width: 100%;
        height: 100%;
        gap: 2%;
      }
      .hour,
      .minute {
        aspect-ratio: 1;
        width: 100%;
        height: 100%;
        
        border-radius: 8px;
        transition: all 0.3s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      }

      .hour.hourone.on {
        background-color: #d35400; //soft red
        box-shadow: 0 0 15px rgba(46,204,113,0.5);
      }
      .hour.hourtwo.on {
        background-color: blue;
        box-shadow: 0 0 15px rgba(46,204,113,0.5);
      }
      .minute.minuteone.on {
        background-color: purple;
        box-shadow: 0 0 15px rgba(46,204,113,0.5);
      }
      .minute.minutetwo.on {
        background-color: green;
        box-shadow: 0 0 15px rgba(46,204,113,0.5);
      }
      .hour.off,
      .minute.off {
        background-color: var(--secondary-background-color, #34495e);
        box-shadow: 0 0 5px rgba(0,0,0,0.5);
      }
    `;
  }
}

customElements.define('lovelace-unary-clock', HaUnaryClockCard);
