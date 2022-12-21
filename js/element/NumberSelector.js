import BaseElement from "../BaseElement.js";
import { css, html } from "../Lit.js";

const style = css`
:host{
  display:block;
}
#container{
  display:flex;
  flex-flow:row;
  align-items:center;
  gap:.5rem;
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

class NumberSelector extends BaseElement {
  static get styles(){
    return [super.styles, style];
  }
  static get properties(){
    return {
      min:{type:Number},
      max:{type:Number},
      value:{type:Number},
    }
  }
  constructor(){
    super();
  }
  render(){
    return html`
    <div id=container class="controls">
      <i class="button" @click=${e=>{
        this.dispatchEvent(new CustomEvent("push"));
        const old = this.value;
        this.value = Math.max(this.min, this.value-1);
        if(old !== this.value){
          this.dispatchEvent(new CustomEvent("change", {detail:{value:this.value}}));
        }
      }}>remove</i>
      <div class="display">${this.value}</div>
      <i class="button" @click=${e=>{
        this.dispatchEvent(new CustomEvent("push"));
        const old = this.value;
        this.value = Math.min(this.max, this.value+1);
        if(old !== this.value){
          this.dispatchEvent(new CustomEvent("change", {detail:{value:this.value}}));
        }
      }}>add</i>
    </div>
    `;
  }
}

customElements.define("number-selector", NumberSelector);