import {LitElement, html, css} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import IconFonts from "../style/IconFonts.js";
import chapters from "../../questions/index.js";
import sound from "../sound.js";

const style = css`
:host{
  display:contents;
}
#container{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  width:100%;
  padding:16px;
  gap:16px;
  box-sizing:border-box;
}
.chapter{
  display:flex;
  flex-flow:row;
  gap:1rem;
  padding:.5rem;
  align-items:center;
}
.icon{
  width:30%;
  aspect-ratio:1;
  background:lightgray;
}
.chapter .title{
  font-size:1.2rem;
  flex-grow:1;
}
`;
class SelectChapterPage extends LitElement{
  constructor(){
    super();
  }
  static get styles(){
    return [style, IconFonts];
  }
  beforePopState(){
    sound.push.play();
    router.open("/");
  }
  render(){
    return html`
    <layout-main bar-title="問題を解く" .back=${()=>this.beforePopState()}>
      <div id=container>
        ${chapters.map(chapter=>html`
          <button class="chapter" @click=${e=>{
            sound.push.play();
            router.open("/select-question", {chapterId:chapter.id});
          }}>
            <div class="title">${chapter.name}</div>
          </button>
        `)}
      </div>
    </layout-main>
    `;
  }
}
customElements.define("select-chapter-page", SelectChapterPage);
export default SelectChapterPage;