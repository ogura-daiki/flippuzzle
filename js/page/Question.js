import {LitElement, html, css} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import sound from "../sound.js";
import { boardToHash, range } from "../util.js";

class QuestionPage extends LitElement{
  static get properties(){
    return {
      vertical:{type:Boolean, state:true},
      pattern:{type:Array},
      start:{type:Array},
      board:{type:Array, state:true},
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
    this.board = JSON.parse(JSON.stringify(this.start));
  }
  static get styles(){
    return css`
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
      padding:16px;
      gap:16px;
      box-sizing:border-box;
    }

    #container.vertical {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr min-content 1fr;
      grid-template-areas: 'pattern' 'menu' 'play-area';
    }
    #container {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr min-content;
      grid-template-areas: 'pattern play-area' 'menu menu';
    }


    .holder.pattern {
      grid-area: pattern;
    }
    #menu {
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
    #menu{
      height:fit-content;
      padding:8px;
      display:flex;
      flex-flow:row nowrap;
      place-content:center;
    }
    #menu>button{
      padding:8px;
    }
    `
  }
  resetBoardIfNeeded(){
    if(boardToHash(this.board) !== boardToHash(this.start)){
      this.board = JSON.parse(JSON.stringify(this.start));
      sound.reset.play();
    }
  }
  render(){
    return html`
    <div id=container class="${this.vertical?"vertical":""}">
      <div class="holder pattern">
        <flip-board id=pattern .board=${this.pattern}></flip-board>
      </div>
      <div id=menu>
        <button
          @click=${e=>{this.resetBoardIfNeeded()}}
        >リセット</button>
      </div>
      <div class="holder play-area">
        <flip-board
          id=play-board
          .board=${this.board}
          @flip=${e=>{
            if(boardToHash(this.pattern) === boardToHash(this.board)){
              alert("クリア！！！");
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
        //盤面とパネルのサイズ調整
        const min = Math.min(holder.clientHeight, holder.clientWidth);
        board.style = `--panel-width:${min/4}px`;
        board.style.width = min+"px";
        board.style.height = min+"px";
      }).observe(holder);
    })
  }
}
customElements.define("page-question", QuestionPage);
export default QuestionPage;