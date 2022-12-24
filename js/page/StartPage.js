import {html, css, when} from "../Lit.js";
import BaseElement from "../BaseElement.js";
import sound from "../sound.js";
import RuleExplanations from "./dialog/RuleExplanations.js";

const style = css`
:host{
  display:block;
  width:100%;
  height:100%;
}
#container{
  display:flex;
  flex-flow:row nowrap;
  width:100%;
  height:100%;
  padding:16px;
  gap:16px;
  box-sizing:border-box;
}
#container.vertical{
  flex-flow:column nowrap;
}
#wrapper{
  width:100%;
  flex-basis:0px;
  flex-grow:1;
  position:relative;
  display:grid;
  place-items:center;
}
#icon{
  width:100%;
  height:100%;
  display:block;
  object-fit:contain;
  position:absolute;
  top:0px;
  left:0px;
}
#buttons{
  display:flex;
  flex-flow:column nowrap;
  gap:1rem;
  justify-content:center;
  width:50%;
}
.vertical #buttons{
  width:100%;
}
#buttons button{
  height:4rem;
  padding: 0.5rem 1rem;
  font-size:1rem;
}
`;
class StartPage extends BaseElement {
  static get properties(){
    return {
      vertical:{type:Boolean, state:true},
    }
  }
  constructor(){
    super();
  }
  static get styles(){
    return [super.styles, style];
  }
  connectedCallback(){
    super.connectedCallback();
    new ResizeObserver(()=>{
      const isVertical = this.clientWidth < this.clientHeight*0.9;
      this.vertical = isVertical;
    }).observe(this);
  }
  beforePopState(){
    //router.open("/");
    sound.push.play();
    return new Promise(resolve=>{
      router.openDialog({title:"test", content:html`
        <div class=fill style="padding:1rem;box-sizing:border-box;">
          終了しますか？
        </div>
      `, buttons:[
        {label:"キャンセル", action:()=>{
          resolve(false);
        }},
        {label:"終了する", action:()=>{
          resolve(true);
        }},
      ], onClose:()=>{
        resolve(false);
      }});
    });
  }
  render(){
    return html`
    <layout-main bar-title="FlipPuzzle">
      <div id=container class="${when(this.vertical, ()=>"vertical")}">
        <div id=wrapper>
          <img id=icon src="./images/icons/icon256.png">
        </div>
        <div id=buttons>
          <button class="button" @click=${e=>router.openDialog({
            title:"操作説明",
            content: RuleExplanations,
          })}>操作説明</button>
          <button class="button" @click=${e=>{
            sound.push.play();
            router.open("/select-chapter");
          }}>問題を解く</button>
          <button class="button" @click=${e=>router.open("/free-play", {test:1})}>練習モード</button>
        </div>
      </div>
    </layout-main>
    `;
  }
}
customElements.define("start-page", StartPage);
export default StartPage;