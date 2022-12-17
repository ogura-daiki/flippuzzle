import BaseElement from "../../BaseElement.js";
import {html, css } from "../../Lit.js";
import IconFonts from "../../style/IconFonts.js";

const style = css`
:host{
  display:contents;
  user-select:none;
}
#container{
  display:grid;
  place-items:center;
  padding:1rem 0px;
  height:100%;
  box-sizing:border-box;
}
#name{
  font-size:1.5rem;
}
#scoreContainer{
  position:relative;
}
#scoreContainer i{
  font-size:4.5rem;
}
.layer{
  position:absolute;
  top:0px;
  left:0px;
}
.list{
  display:flex;
  flex-flow:row nowrap;
  gap:.5rem;
}
`;

class QuestionResultDialog extends BaseElement {
  static get properties(){
    return {
      step:{type:Number},
      takenSteps:{type:Number},
      questionName:{type:String},
    };
  }
  static get styles(){
    return [style, IconFonts];
  }
  constructor(){
    super();
  }

  #calcScore(){
    let score;
    if(this.takenSteps <= this.step){
      score = 3;
    }else if(this.takenSteps <= this.step*1.75){
      score = 2;
    }else if(this.takenSteps <= this.step*2.5){
      score = 1;
    }else{
      score = 0;
    }
    return score;
  }

  render(){
    const score = this.#calcScore();
    return html`
    <div id=container>
      <div>問題：<span id=name>${this.questionName}</span></div>
      <div id="scoreContainer">
        <div>${[...Array(3)].map(()=>html`<i class="fill" style="color:white">star</i>`)}</div>
        <div class="layer">${[...Array(score)].map(()=>html`<i class="fill" style="color:yellow">star</i>`)}</div>
        <div class="layer">${[...Array(3)].map(()=>html`<i>star</i>`)}</div>
      </div>
    </div>
    `;
  }
}
customElements.define("dialog-question-result", QuestionResultDialog);

export default QuestionResultDialog;