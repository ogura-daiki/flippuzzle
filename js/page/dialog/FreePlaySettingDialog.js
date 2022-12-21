import {html, css } from "../../Lit.js";
import BaseElement from "../../BaseElement.js";
import { colors } from "../../baseTheme.js";
import sound from "../../sound.js";

const style = css`
:host{
  user-select:none;
  display:flex;
  flex-flow:column;
  gap:.5rem;
  padding:.5rem;
}
.title{
  font-size:1.1rem;
}
label{
  display:flex;
  flex-flow:row;
  align-items:center;
}

number-selector{
  margin-left:.5rem;
}
`;

class FreePlaySettingDialog extends BaseElement {
  static get properties(){
    return {
      min:{type:Number},
      max:{type:Number},
      startRandom:{type:Boolean},
      size:{type:Object},
    };
  }
  static get styles(){
    return [
      super.styles,
      style,
    ];
  }
  constructor(){
    super();
  }

  #sizeChanged(){
    this.max = Math.min(this.size.x*this.size.y, this.max);
    this.min = Math.min(this.max, this.min);
    this.requestUpdate();
  }
  render(){
    return html`
    
      <div class="title">縦タイル数</div>
      <number-selector
        .min=${3} .max=${8} .value=${this.size.y}
        @push=${()=>sound.push.play()}
        @change=${({detail:{value}})=>{
          this.size.y = value;
          this.#sizeChanged();
        }}
      ></number-selector>

      <div class="title">横タイル数</div>
      <number-selector
        .min=${3} .max=${8} .value=${this.size.x}
        @push=${()=>sound.push.play()}
        @change=${({detail:{value}})=>{
          this.size.x = value;
          this.#sizeChanged();
        }}
      ></number-selector>

      <div class="title">最小手数</div>
      <number-selector
        .min=${1} .max=${this.max} .value=${this.min}
        @push=${()=>sound.push.play()}
        @change=${({detail:{value}})=>{
          this.min = value;
        }}
      ></number-selector>

      <div class="title">最大手数</div>
      <number-selector
        .min=${this.min} .max=${this.size.x*this.size.y} .value=${this.max}
        @push=${()=>sound.push.play()}
        @change=${({detail:{value}})=>{
          this.max = value;
        }}
      ></number-selector>
      
      <label>
        <input
          class="checkbox icon-font"
          type=checkbox
          ?checked=${this.startRandom}
          @change=${e=>{
            sound.push.play();
            this.startRandom = e.target.checked;
          }}
        >
        開始パターンをランダムにするか
      </label>
    `;
  }
}

customElements.define("dialog-freeplaysetting", FreePlaySettingDialog);
export default FreePlaySettingDialog;

