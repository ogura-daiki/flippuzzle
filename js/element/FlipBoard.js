import { html, css } from "../Lit.js";
import BaseElement from "../BaseElement.js";
import sound from "../sound.js";
import { clamp, range, flipBoard } from "../util.js";

const style = css`
:host{
  display:block;
  --img-src: url(./wood.png);
  --img-count: 7;
  --flip-duration-def:.2s;
  --panel-width-def:0px;
}
.panel{
  background: var(--img-src) no-repeat;
  width:var(--panel-width, var(--panel-width-def));
  height:var(--panel-width, var(--panel-width-def));
  background-size: 100% auto;
  image-rendering: pixelated;
  user-select:none;
}
.panel.front{
  animation: flip var(--flip-duration, var(--flip-duration-def)) steps(calc(var(--img-count) - 1)) 1 reverse forwards;
}
.panel.back{
  animation: flip2 var(--flip-duration, var(--flip-duration-def)) steps(calc(var(--img-count) - 1)) 1 normal forwards;
}
@keyframes flip{
  from{
    background-position: 0px 0px;
  }
  to{
    background-position: 0pc calc(var(--panel-width, var(--panel-width-def)) * calc(var(--img-count) - 1) * -1);
  }
}
@keyframes flip2{
  from{
    background-position: 0px 0px;
  }
  to{
    background-position: 0pc calc(var(--panel-width, --panel-width-def) * calc(var(--img-count) - 1) * -1);
  }
}

.container{
  display:grid;
  grid-template-columns: repeat(var(--panel-count), var(--panel-width, --panel-width-def));
}
`;

class FlipBoard extends BaseElement {
  static get properties(){
    return {
      board:{type:Array},
    };
  }
  static get styles(){
    return [super.styles, style];
  }
  constructor(){
    super();
    this.board = range(4).map(()=>Array(4).fill(false));
  }  
  connectedCallback(){
    super.connectedCallback();
  }
  #panel({x,y}){
    const flipped = this.board[y][x];
    return html`
    <div
      class="panel ${flipped?"back":"front"}"
      data-x=${x} data-y=${y}
      ></div>
    `;
  }
  #getPanelPosFromTarget(target){
    if(!target) return;
    const classNames = new Set(target.className.split(" ").filter(v=>v));
    if(classNames.has("panel")){
      let {x, y} = target.dataset;
      x=+x;
      y=+y;
      return {x, y};
    }
  }
  #getPanelPos(e){
    if(e instanceof MouseEvent){
      const pos = this.#getPanelPosFromTarget(e.target);
      return pos;
    }
    const board = this.getBoundingClientRect();
    const panelRect = this.renderRoot.querySelector(".panel").getBoundingClientRect();
    for(const y of range(this.board.length)){
      for(const x of range(this.board[0].length)){
        const panelTop = board.top+(panelRect.height*y);
        const panelLeft = board.left+(panelRect.width*x);
        if(panelTop <= e.clientY && e.clientY < panelTop + panelRect.height){
          if(panelLeft <= e.clientX && e.clientX < panelLeft + panelRect.width){
            return {x,y};
          }
        }
      }
    }
  }
  #onClick({x,y}){
    flipBoard(this.board, {x, y});
    sound.flip.play();
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent("flip", {bubbles:true, composed:true, detail:{x,y}}));
  }
  #equalsPos(p1, p2){
    if(!p1 || !p2) return false;
    return p1.x === p2.x && p1.y === p2.y;
  }
  #pos = null;
  #beforeTouch = null;
  #onPointerUp(e){
    const pos = this.#getPanelPos(e);
    if(this.#equalsPos(pos, this.#pos)) this.#onClick(pos);

    this.#pos = null;
    this.#beforeTouch = null;
  }
  render(){
    return html`
    <style>
    :host{
      --panel-count:${this.board[0].length};
    }
    </style>
    <div class="container"
      @pointerdown=${e=>{
        this.#pos = this.#getPanelPos(e);
      }}
      @touchmove=${e=>{
        this.#beforeTouch = e.touches[0];
      }}
      @touchend=${e=>{
        if(!this.#pos) return;
        if(!this.#beforeTouch) return;
        this.#onPointerUp(this.#beforeTouch);
      }}
      @mouseup=${e=>{
        if(!this.#pos) return;
        this.#onPointerUp(e);
      }}
    >
      ${range(this.board.length).map(y=>html`${
        range(this.board[0].length).map(x=>html`${
          this.#panel({x,y})
        }`)
      }`)}
    </div>
    `;
  }
}
customElements.define("flip-board", FlipBoard);