import {html, css} from "../Lit.js";
import BaseElement from "../BaseElement.js";
import chapters from "../../questions/index.js";
import sound from "../sound.js";
import { colors } from "../baseTheme.js";

const style = css`
:host{
  display:contents;
}
#description{
  padding:1rem;
  background:${colors.secondary.onBase};
  color:${colors.secondary.text};
  margin:1rem;
  margin-bottom:0px;
  /* border:.2rem solid ${colors.secondary.base}; */
  border-radius:.5rem;
  box-shadow: 1px 2px 4px 1px ${colors.background.onBase.a(0.2)};
}
#container{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  width:100%;
  padding:1rem;
  gap:1rem;
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
class SelectQuestionPage extends BaseElement {
  static get properties(){
    return {
      chapter:{type:Object},
    }
  }
  constructor(){
    super();
  }
  static get styles(){
    return [super.styles, style];
  }
  set chapterId(id){
    this.chapter = chapters.find(c=>c.id === id);
  }
  beforePopState(){
    sound.push.play();
    router.open("/select-chapter");
  }
  render(){
    if(!this.chapter) return;
    return html`
    <layout-main bar-title=${this.chapter.name} .back=${()=>this.beforePopState()}>
      <div id=description>${this.chapter.description}</div>
      <div id=container>
        ${this.chapter.questions.map(q=>html`
          <button class="button question" @click=${e=>{
            //sound.push.play();
            router.open("/question", {
              chapterQuestion:{
                chapterId:this.chapter.id,
                questionId:q.id
              }
            });
          }}>
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