import BaseElement from "../BaseElement.js";
import { css, html, when } from "../Lit.js";

const style = css`
:host{
  display:block;
  height:fit-content;
  width:fit-content;
}
#container{
  width:100%;
  height:100%;
  display:flex;
  flex-flow:column nowrap;
  justify-content:center;
  background:rgb(200,150,75);
  padding:.4rem;
  gap:.3rem;
  font-size:.8rem;
  line-height:1;
  border-radius:.2rem;
  box-sizing:border-box;
}
`;

class StatusElement extends BaseElement {
  static get styles(){
    return [super.styles, style];
  }

  static get properties(){
    return {
      step:{type:Number},
      currentStep:{type:Number},
      clear:{type:Number},
      beforeClick:{type:Object},
    };
  }

  render(){
    return html`
    <div id=container>
      <div>生成手数：${this.step}手</div>
      <div>${when(
        this.clear,
        ()=>html`クリア(${this.clear}手)`,
        ()=>when(
          this.currentStep <= this.step,
          ()=>html`残り：${this.step - this.currentStep}手`,
          ()=>html`${this.currentStep - this.step}手オーバー`,
        )
      )}</div>
      <div>
        前回：${when(this.beforeClick,()=>`${this.beforeClick.y+1},${this.beforeClick.x+1}`, ()=>`-,-`)}
      </div>
    </div>
    `;
  }
}

customElements.define("elem-status", StatusElement);
