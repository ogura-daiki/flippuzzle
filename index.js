import {LitElement, html, css} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";

const range = (...vals) => {
  if(vals.length===1){
    return range(0,vals);
  }
  const [start, end] = vals;
  return [... Array(end-start)].map((_,i)=>i+start);
}
const clamp = (min, v, max) => Math.max(min, Math.min(v, max));
const boardToHash = (board) => board.map(row=>row.map(v=>v?1:0).join(",")).join("|");

const sound = {
  flip:new Howl({
    src: ['./sounds/flip.mp3']
  }),
  push:new Howl({
    src: ['./sounds/push.mp3']
  }),
  reset:new Howl({
    src: ['./sounds/reset.mp3']
  }),
  generate:new Howl({
    src: ['./sounds/generate.mp3']
  }),
}

class FlipBoard extends LitElement {
  static get properties(){
    return {
      board:{type:Array},
    };
  }
  static get styles(){
    return css`
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
      grid-template-columns: repeat(4, var(--panel-width, --panel-width-def));
    }
    `;
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
    for(const y of range(4)){
      for(const x of range(4)){
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
    for(let iy = clamp(0, y-1, 4); iy < Math.min(y+2, 4); iy+=1){
      for(let ix = clamp(0, x-1, 4); ix < Math.min(x+2, 4); ix+=1){
        this.board[iy][ix] = !this.board[iy][ix];
      }
    }
    sound.flip.play();
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent("flip"));
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
  }
  render(){
    return html`
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
      ${range(4).map(y=>html`${
        range(4).map(x=>html`${
          this.#panel({x,y})
        }`)
      }`)}
    </div>
    `;
  }
}
customElements.define("flip-board", FlipBoard);

class App extends LitElement{
  static get properties(){
    return {
      vertical:{type:Boolean},
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
  render(){
    return html`
    <div id=container class="${this.vertical?"vertical":""}">
      <div class="holder pattern">
        <flip-board id=pattern .board=${this.pattern}></flip-board>
      </div>
      <div id=menu>
        <button
          @click=${e=>{
            const playBoard = this.renderRoot.querySelector("#play-board");
            playBoard.board = JSON.parse(JSON.stringify(this.start));
            sound.reset.play();
          }}
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
customElements.define("main-app", App);

document.body.append(new App());
