import {LitElement, html, css} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";

const range = (...vals) => {
  if(vals.length===1){
    return range(0,vals);
  }
  const [start, end] = vals;
  return [... Array(end-start)].map((_,i)=>i+start);
}
const clamp = (min, v, max) => Math.max(min, Math.min(v, max));

class FlipBoard extends LitElement {
  static get properties(){
    return {};
  }
  static get styles(){
    return css`
    :host{
      --img-src: url(./wood.png);
      --img-count: 7;
      --flip-duration-def:.2s;
      --panel-width-def:128px;
      width:100%;
      display:block;
    }
    .panel{
      background: var(--img-src) no-repeat;
      width:var(--panel-width, var(--panel-width-def));
      height:var(--panel-width, var(--panel-width-def));
      background-size: 100% auto;
      image-rendering: pixelated;
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
    new ResizeObserver(()=>{
      this.style = `--panel-width:${this.offsetWidth/4}px`;
    }).observe(this);
  }
  #panel({x,y}){
    const flipped = this.board[y][x];
    return html`
    <div class="panel ${flipped?"back":"front"}" data-x=${x} data-y=${y}></div>
    `;
  }
  render(){
    return html`
    <div class="container" @click=${e=>{
      const classNames = new Set(e.target.className.split(" ").filter(v=>v));
      if(!classNames.has("panel")) return;
      let {x, y} = e.target.dataset;
      x=+x;
      y=+y;
      console.log({x,y}, clamp(0, y-1, 4), clamp(0, y+2, 4));
      for(let iy = clamp(0, y-1, 4); iy < Math.min(y+2, 4); iy+=1){
        for(let ix = clamp(0, x-1, 4); ix < Math.min(x+2, 4); ix+=1){
          this.board[iy][ix] = !this.board[iy][ix];
        }
      }
      this.requestUpdate();
    }}>
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

document.body.append(new FlipBoard());
