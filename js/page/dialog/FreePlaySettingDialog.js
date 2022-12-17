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

.controls{
  display:flex;
  flex-flow:row;
  align-items:center;
  gap:.5rem;
  margin-left:.5rem;
}
.controls .button{
  padding:.4rem;
  border-radius:.2rem;
}
.controls .display{
  width:2rem;
  display:grid;
  place-items:center;
}
`;

class FreePlaySettingDialog extends BaseElement {
  static get properties(){
    return {
      min:{type:Number},
      max:{type:Number},
      startRandom:{type:Boolean},
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
  render(){
    return html`
      <div class="title">最小手数</div>
      <div class="controls" style="display:flex;flex-flow:row;">
        <i class="button" @click=${e=>{
          this.min = Math.max(1, this.min-1);
          sound.push.play();
        }}>remove</i>
        <div class="display">${this.min}</div>
        <i class="button" @click=${e=>{
          this.min = Math.min(this.max, this.min+1);
          sound.push.play();
        }}>add</i>
      </div>
      <div class="title">最大手数</div>
      <div class="controls" style="display:flex;flex-flow:row;">
        <i class="button" @click=${e=>{
          this.max = Math.max(this.min, this.max-1);
          sound.push.play();
        }}>remove</i>
        <div class="display">${this.max}</div>
        <i class="button" @click=${e=>{
          this.max = Math.min(16, this.max+1);
          sound.push.play();
        }}>add</i>
      </div>
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

