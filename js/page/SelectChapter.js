import {html, css} from "../Lit.js";
import BaseElement from "../BaseElement.js";
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
  flex-flow:column;
  gap:1rem;
  padding:1rem;
  align-items:center;
}
.chapter .title{
  font-size:1.5rem;
  flex-grow:1;
}
`;
class SelectChapterPage extends BaseElement {
  constructor(){
    super();
  }
  static get styles(){
    return [super.styles, style];
  }
  beforePopState(){
    sound.push.play();
    return true;
  }
  render(){
    return html`
    <layout-main bar-title="問題を解く" .back=${()=>this.beforePopState()}>
      <div id=container>
        ${chapters.map(chapter=>html`
          <button class="button chapter" @click=${e=>{
            sound.push.play();
            router.open("/select-question", {chapterId:chapter.id});
          }}>
            <div class="title">${chapter.name}</div>
            <div class="description">${chapter.description}</div>
          </button>
        `)}
      </div>
    </layout-main>
    `;
  }
}
customElements.define("select-chapter-page", SelectChapterPage);
export default SelectChapterPage;