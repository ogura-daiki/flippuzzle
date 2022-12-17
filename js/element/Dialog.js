import { html, css } from "../Lit.js";
import BaseElement from "../BaseElement.js";
import { colors } from "../baseTheme.js";
import sound from "../sound.js";

const style = css`
:host{
  display:block;
  background:${colors.background.base};
  max-height:calc(100vh - 4rem);
  height:fit-content;
  overflow-y:scroll;
  contain:layout;
}

:host::-webkit-scrollbar {
  width:0px;
  height:0px;
}
#container{
  min-height:30vh;
  min-width:50vw;
}
#titlebar{
  background:${colors.primary.base};
  color:${colors.primary.text};
  font-size:1.5rem;
  position:sticky;
  z-index:1;
  top:0px;
  user-select:none;
}
#title{
  padding: .5rem 1rem;
}
#closeIcon{
  padding:1rem;
  font-size:1.5rem;
}
#content{
  user-select:none;
}
#buttons{
  background:${colors.background.base};
  padding:.2rem .4rem;
  gap:.5rem;
  border-top:lightgray 1px solid;
  position:sticky;
  z-index:1;
  bottom:0px;
  justify-content: end;
  user-select:none;
}
#buttons button{
  background:${colors.background.base};
  color:${colors.background.text};
  font-size:1rem;
  padding:.5rem .8rem;
  border:none;
}
.shadow{
  height:.5rem;
  width:100%;
  position:absolute;
  left:0px;
  transition:opacity .3s;
}
.shadow.top{
  background:linear-gradient(180deg, rgba(0,0,0,.1), transparent);
  bottom:0px;
  transform:translateY(100%);
}
.shadow.bottom{
  background:linear-gradient(0deg, rgba(0,0,0,.1), transparent);
  bottom:100%;
}

#track{
  position:absolute;
  width:.25rem;
  background:rgba(128,128,128,.2);
  bottom:0px;
  right:0px;
  transform:translateY(100%);
}
#bar{
  position:absolute;
  width:100%;
  background:rgba(128,128,128,.2);
}


.col, .row, .centering{
  display:flex;
  gap:.5rem;
}
.col{
  flex-direction: column;
}
.row{
  flex-direction: row;
}
.centering{
  place-content:center;
  place-items:center;
}
:is(.col, .row, .centering).inline{
  display:inline-flex;
}
:is(.col, .row, .centering).wrap{
  flex-wrap:wrap;
}
.grow{
  flex-grow:1;
  flex-basis:0px;
}

.gap-0 { gap:0px }
.gap-16{ gap:1rem }
`;

class Dialog extends BaseElement {

  static get properties() {
    return {
      title: { type:String },
      content: { type:Object },
      buttons: { type:Array },
    };
  }

  constructor(){
    super();
    this.title = "FlipPuzzle";
    this.content = "";
    this.buttons = [{label:"閉じる", action:e=>router.closeDialog()}];
  }

  static get styles(){
    return [
      super.styles,
      style,
    ];
  }

  render() {
    return html`
      <div id=container class="col gap-0">
        <div id=titlebar class="row centering gap-0">
          <span id=title class=grow>${this.title}</span>
          <i
            id=closeIcon
            class="fill centering"
            @click=${e=>{
              sound.push.play();
              router.closeDialog();
            }}
          >close</i>
          <div class="shadow top" style="opacity:0"></div>
          <div id="track">
            <div id="bar"></div>
          </div>
        </div>
        <section class="grow" id=content>
        ${this.content}
        </section>
        <div id=buttons class="row wrap">
          <div class="shadow bottom" style="opacity:0"></div>
          ${this.buttons.map(({label, action})=>html`
            <button
              @click=${e=>{
                sound.push.play();
                if(!action){
                  router.closeDialog();
                  return;
                }
                action(e);
              }}
            >${label}</button>
          `)}
        </div>
      </div>
    `;
  }

  firstUpdated(){
    const find = q => this.renderRoot.querySelector(q);
    const content = find("#content");
    const title = find("#titlebar");
    const buttons = find("#buttons");
    const shadowTop = find(".shadow.top");
    const shadowBottom = find(".shadow.bottom");
    const track = find("#track");
    const bar = find("#bar");
    
    let timerID;
    const calcScroll = ()=>{
      const func = ()=>{
        const max = this.scrollHeight - this.clientHeight;
        const contentHeight = this.clientHeight-title.clientHeight-buttons.clientHeight;
        track.style.height = contentHeight+"px";
        bar.style.height = (this.clientHeight/this.scrollHeight*100)+"%";
        if(max === 0){
          track.style.opacity=0;
          shadowTop.style.opacity=0;
          shadowBottom.style.opacity=0;
          return;
        }
        track.style.opacity=1;
        const current = this.scrollTop / max * 100;
        bar.style.top = this.scrollTop / this.scrollHeight*100 + "%";
        shadowTop.style.opacity=current>=1?1:0;
        shadowBottom.style.opacity=current<=99?1:0;
      }
      clearTimeout(timerID);
      timerID = requestAnimationFrame(func);
    }
    this.addEventListener("scroll", e=>{
      calcScroll();
    })
    this.addEventListener("wheel", e=>{
      calcScroll();
    })
    new ResizeObserver(()=>{
      calcScroll();
    }).observe(content);
    window.addEventListener("resize", e=>calcScroll());
    calcScroll();
  }
}
customElements.define("elem-dialog", Dialog);