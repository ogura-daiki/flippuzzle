import BaseElement from "../BaseElement.js";
import {html, css} from "../Lit.js";
import sound from "../sound.js";
import { boardToHash, range } from "../util.js";

const style = css`
:host{
  display:block;
  width:100%;
  height:100%;
  display:grid;
  place-items:center;
}
#container {
  width: 100%;
  height: 100%;
  display: grid;
  gap:16px;
  box-sizing:border-box;
}

#container.vertical {
  padding:16px;
  gap:16px;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr min-content 1fr;
  grid-template-areas: 'pattern' 'menu' 'play-area';
}
#container {
  padding:8px;
  gap:8px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr min-content;
  grid-template-areas: 'pattern play-area' 'menu play-area';
}


.holder.pattern {
  grid-area: pattern;
}
#menu {
  display:block;
  grid-area: menu;
}
.holder.play-area {
  grid-area: play-area;
}


.holder{
  flex-grow:1;
  position:relative;
}
flip-board{
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%, -50%);
}
#pattern{
  pointer-events:none;
  user-select:none;
}
`;

class Question extends BaseElement {
  static get properties(){
    return {
      vertical:{type:Boolean, state:true},
      pattern:{type:Array},
      start:{type:Array},
    }
  }
  constructor(){
    super();
    new ResizeObserver(()=>{
      const isVertical = this.clientWidth < this.clientHeight;
      this.vertical = isVertical;
    }).observe(this);
    this.pattern = range(4).map((v,i)=>Array(4).fill(true));
    this.start = range(4).map((v,i)=>Array(4).fill(false));
  }
  static get styles(){
    return [super.styles, style];
  }
  resetBoardIfNeeded(){
    const playBoard = this.renderRoot.querySelector("#play-board");
    if(boardToHash(playBoard.board) !== boardToHash(this.start)){
      playBoard.board = JSON.parse(JSON.stringify(this.start));
      this.dispatchEvent(new CustomEvent("reset", {bubbles:true, composed:true}));
    }
  }
  render(){
    return html`
    <div id=container class="${this.vertical?"vertical":""}">
      <div class="holder pattern">
        <flip-board id=pattern .board=${this.pattern}></flip-board>
      </div>
      <slot id=menu name=menu></slot>
      <div class="holder play-area">
        <flip-board
          id=play-board
          .board=${JSON.parse(JSON.stringify(this.start))}
          @flip=${e=>{
            const board = this.renderRoot.querySelector("#play-board").board;
            if(boardToHash(this.pattern) === boardToHash(board)){
              e.stopPropagation();
              this.dispatchEvent(new CustomEvent("flip", {bubbles:true, composed:true, detail:e.detail}));
              this.dispatchEvent(new CustomEvent("clear", {bubbles:true, composed:true}));
            }
          }}
        ></flip-board>
      </div>
    </div>
    `
  }
  updated(){
    this.renderRoot.querySelectorAll(".holder").forEach(holder=>{
      new ResizeObserver(()=>{
        const board = holder.querySelector("flip-board");
        if(!board) return;
        const ratio = this.start[0].length/this.start.length;
        //盤面とパネルのサイズ調整
        let min;
        if(holder.clientHeight*ratio < holder.clientWidth){
          min = holder.clientHeight*ratio;
        }
        else{
          min = holder.clientWidth;
        }
        board.style = `--panel-width:${min/this.start[0].length}px`;
        board.style.width = min+"px";
        board.style.height = (min/ratio)+"px";
      }).observe(holder);
    })
  }
}
customElements.define("elem-question", Question);
export default Question;