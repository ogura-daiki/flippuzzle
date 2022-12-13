import {LitElement, html, css, when } from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import sound from "../sound.js";
import { flipBoard, range } from "../util.js";

const generate = ()=>{
  const pattern = range(4).map(()=>range(4).map(v=>Math.random() >= 0.5));
  const start = JSON.parse(JSON.stringify(pattern));
  const min = 2;
  const max = 8;
  const step = Math.ceil(Math.random()*(max-min))+min;

  const list = new Set();
  const rand = ()=>Math.floor(Math.random()*4);
  while([...list.values()].length < step){
    list.add(`${rand()}:${rand()}`);
  };
  [...list.values()].forEach((pos)=>{
    let [y, x] = pos.split(":");
    y = +y;
    x = +x;
    flipBoard(start, {x,y});
  });
  return {pattern, start, step};
}


class FreePlayPage extends LitElement{
  static get properties(){
    return {
      pattern:{type:Array},
      start:{type:Array},
      step:{type:Number},
      currentStep:{type:Number},
      clear:{type:Boolean, state:true},
    }
  }
  constructor(){
    super();
    this.step = 4;
    this.currentStep = 0;
    this.pattern = range(4).map(()=>Array(4).fill(true));
    this.start = range(4).map(()=>Array(4).fill(false));
    this.clear = false;
  }
  static get styles(){
    return css`
    #menu{
      height:fit-content;
      padding:8px;
      display:flex;
      flex-flow:row nowrap;
      gap:.4rem;
      place-content:center;
      user-select:none;
    }
    #menu button{
      padding:.4rem .6rem;
      font-size:.8rem;
    }
    #menu #status{
      display:flex;
      flex-flow:column nowrap;
      justify-content:center;
      background:rgb(200,150,75);
      padding:.4rem;
      gap:.3rem;
      font-size:.8rem;
      line-height:1;

      border-radius:.2rem;
    }
    `
  }
  #genTimer;
  regenerate(){
    const question = this.renderRoot?.querySelector("#q");
    const {pattern, start, step} = generate();
    this.clear = false;
    this.step = step;
    this.currentStep = 0;
    this.pattern = range(4).map(()=>Array(4).fill(true));
    this.start = range(4).map(()=>Array(4).fill(false));
    sound.generate.stop();
    sound.generate.play();
    clearTimeout(this.#genTimer);
    this.#genTimer = setTimeout(()=>{
      this.pattern = pattern;
      this.start = start;
      question?.resetBoardIfNeeded();
    }, 300);
  }
  render(){
    return html`
    <layout-main back bar-title="練習モード">
      <elem-question id=q .pattern=${this.pattern} .start=${this.start}
        @flip=${e=>{
          this.currentStep+=1;
        }}
        @clear=${e=>{
          this.clear = true;
        }}
        @reset=${e=>{
          sound.reset.play();
        }}
      >
        <div id=menu slot=menu>
          <button
            @click=${e=>{
              this.renderRoot.querySelector("#q").resetBoardIfNeeded()
              this.currentStep = 0;
              this.clear = false;
            }}
            >
            パネル<br>リセット
          </button>
          <button
            @click=${e=>{this.regenerate()}}
          >
            再生成
          </button>
          <button @click=${e=>alert("工事中")}>
            設定
          </button>
          <div id=status>
            <div>生成手数：${this.step}手</div>
            <div>${when(
              this.clear,
              ()=>html`クリア!!!`,
              ()=>when(
                this.currentStep <= this.step,
                ()=>html`残り：${this.step - this.currentStep}手`,
                ()=>html`${this.currentStep - this.step}手オーバー`,
              )
            )}</div>
          </div>
        </div>
      </elem-question>
    </layout-main>
    `;
  }
}
customElements.define("free-play", FreePlayPage);
export default FreePlayPage;