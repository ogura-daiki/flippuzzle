import {LitElement, html, css} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import IconFonts from "../style/IconFonts.js";
import chapters from "../../questions/index.js";

const style = css`
:host{
  display:contents;
}
#description{
  padding:1rem;
}
#container{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  width:100%;
  padding:16px;
  gap:16px;
  box-sizing:border-box;
}
.question{
  display:flex;
  flex-flow:row;
  gap:1rem;
  padding:.5rem;
  align-items:center;
}
.question .title{
  font-size:1.2rem;
  flex-grow:1;
}
`;
class SelectQuestionPage extends LitElement{
  static get properties(){
    return {
      chapter:{type:Object},
    }
  }
  constructor(){
    super();
  }
  static get styles(){
    return [style, IconFonts];
  }
  set chapterId(id){
    this.chapter = chapters.find(c=>c.id === id);
  }
  render(){
    if(!this.chapter) return;
    return html`
    <layout-main bar-title=${this.chapter.name} back>
      <div id=description>${this.chapter.description}</div>
      <div id=container>
        ${this.chapter.questions.map(q=>html`
          <button class="question" @click=${e=>router.open("/question", {chapterQuestion:{chapterId:this.chapter.id, questionId:q.id}})}>
            <div class="title">${q.name}</div>
          </button>
        `)}
      </div>
    </layout-main>
    `;
  }
}
customElements.define("select-question-page", SelectQuestionPage);
export default SelectQuestionPage;