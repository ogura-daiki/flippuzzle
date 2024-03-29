import BaseElement from "../BaseElement.js";
import {html, css, when } from "../Lit.js";
import sound from "../sound.js";
import { flipBoard, range } from "../util.js";
import FreePlaySettingDialog from "./dialog/FreePlaySettingDialog.js";

const generate = ({size, min, max, startRandom})=>{
  const valueGen = !startRandom?()=>false:()=>Math.random() >= 0.5;
  const start = range(size.y).map(()=>range(size.x).map(v=>valueGen()));
  const pattern = JSON.parse(JSON.stringify(start));
  const step = Math.ceil(Math.random()*(max-min+1))+min-1;

  const list = new Set();
  const rand = (range)=>Math.floor(Math.random()*range);
  while([...list.values()].length < step){
    list.add(`${rand(size.y)}:${rand(size.x)}`);
  };
  [...list.values()].forEach((pos)=>{
    let [y, x] = pos.split(":");
    y = +y;
    x = +x;
    flipBoard(start, {x,y});
  });

  if(!startRandom){
    return {pattern:start, start:pattern, step};
  }
  return {pattern, start, step};
}

const style = css`
#menu{
  height:fit-content;
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
`;

class FreePlayPage extends BaseElement {
  static get properties(){
    return {
      pattern:{type:Array},
      start:{type:Array},
      step:{type:Number},
      currentStep:{type:Number},
      beforeClick:{type:Object},
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
    this.beforeClick = null;
    this.genOption = {min:3, max:8, startRandom:true, size:{x:4, y:4}};
  }
  static get styles(){
    return [super.styles, style];
  }
  #genTimer;
  regenerate(){
    const question = this.renderRoot?.querySelector("#q");
    const {pattern, start, step} = generate(this.genOption);
    this.clear = false;
    this.step = step;
    this.currentStep = 0;
    this.beforeClick = null;
    this.pattern = range(this.genOption.size.y).map(()=>Array(this.genOption.size.x).fill(true));
    this.start = range(this.genOption.size.y).map(()=>Array(this.genOption.size.x).fill(false));
    sound.generate.stop();
    sound.generate.play();
    clearTimeout(this.#genTimer);
    this.#genTimer = setTimeout(()=>{
      this.pattern = pattern;
      this.start = start;
      question?.resetBoardIfNeeded();
    }, 300);
  }
  #settingDialog(){
    const content = new FreePlaySettingDialog();
    Object.assign(content, this.genOption);
    router.openDialog({
      title:"設定",
      content,
      buttons:[
        {label:"キャンセル"},
        {label:"変更", action:e=>{
          const {min, max, startRandom, size} = content;
          this.genOption = {min, max, startRandom, size};
        }},
      ],
    })
  }
  render(){
    return html`
    <layout-main bar-title="練習モード" .back=${true}>
      <elem-question id=q .pattern=${this.pattern} .start=${this.start}
        @flip=${e=>{
          this.currentStep+=1;
          this.beforeClick = {x:e.detail.x, y:e.detail.y};
        }}
        @clear=${e=>{
          if(!this.clear){
            this.clear = this.currentStep;
          }
        }}
        @reset=${e=>{
          //sound.reset.play();
        }}
      >
        <div id=menu slot=menu>
          <button
            class="button"
            @click=${e=>{
              this.renderRoot.querySelector("#q").resetBoardIfNeeded();
              if(this.currentStep > 0){
                sound.reset.play();
              }
              this.currentStep = 0;
              this.clear = false;
              this.beforeClick = null;
            }}
            >
            パネル<br>リセット
          </button>
          <button
            class="button"
            @click=${e=>{this.regenerate()}}
          >
            再生成
          </button>
          <button
            class="button"
            @click=${e=>{
              sound.push.play();
              this.#settingDialog();
            }}
          >
            設定
          </button>
          <elem-status
            .step=${this.step}
            .currentStep=${this.currentStep}
            .clear=${this.clear}
            .beforeClick=${this.beforeClick}
          ></elem-status>
        </div>
      </elem-question>
    </layout-main>
    `;
  }
  firstUpdated(){
    sound.generate.play();
  }

  beforePopState(){
    sound.push.play();
    return new Promise(resolve=>{
      router.openDialog({title:"確認", content:html`
          <div class=fill style="padding:1rem;box-sizing:border-box;">
            タイトル画面に戻ってもよろしいですか？
          </div>
        `,
        buttons:[
          {label:"戻らない", action:e=>{
            resolve(false);
          }},
          {label:"戻る", action:e=>{
            resolve(true);
          }},
        ],
        onClose:()=>resolve(false),
      });
    })
  }
}
customElements.define("free-play", FreePlayPage);
export default FreePlayPage;