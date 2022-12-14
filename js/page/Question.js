import {html, css, when } from "../Lit.js";
import sound from "../sound.js";
import chapters from "../../questions/index.js";
import QuestionResultDialog from "./dialog/QuestionResultDialog.js";
import BaseElement from "../BaseElement.js";

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

class QuestionPage extends BaseElement {
  static get properties(){
    return {
      question:{type:Object},
      currentStep:{type:Number},
      beforeClick:{type:Object},
      clear:{type:Boolean, state:true},
    }
  }
  constructor(){
    super();
    this.currentStep = 0;
    this.beforeClick = null;
    this.clear = false;
  }
  static get styles(){
    return [super.styles, style];
  }
  set chapterQuestion({chapterId, questionId}){
    this.chapterId = chapterId;
    const chapter = chapters.find(chapter=>chapter.id === chapterId);
    this.question = chapter?.questions.find(q=>q.id === questionId);
  }

  #reset(){
    this.renderRoot.querySelector("#q").resetBoardIfNeeded();
    if(this.currentStep > 0){
      sound.reset.play();
    }
    this.currentStep = 0;
    this.clear = false;
    this.beforeClick = null;
  }

  #findNextQuestion(){
    const chapterIdx = chapters.findIndex(chapter=>chapter.id === this.chapterId);
    const questionIdx = chapters[chapterIdx].questions.findIndex(q=>q===this.question);
    const nextQuestion = chapters[chapterIdx].questions[questionIdx+1];
    
    if(nextQuestion){
      return {chapter:chapters[chapterIdx], question:nextQuestion};
    }

    const nextChapter = chapters[chapterIdx+1];
    if(!nextChapter){
      return;
    }
    return {chapter:nextChapter, question:nextChapter.questions[0]};
  }

  beforePopState(){
    sound.push.play();
    return new Promise(resolve=>{
      router.openDialog({title:"確認", content:html`
        <div class=fill style="padding:1rem;box-sizing:border-box;">
          問題選択画面に戻ってもよろしいですか？
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
      })
    })
  }

  #showClearDialog(){
    const next = this.#findNextQuestion();
    const buttons = [
      {label:"もう一度", action:e=>{
        this.#reset();
      }},
      {label:"問題選択へ", action:e=>{
        router.back(true);
      }},
    ];

    const showResult = new QuestionResultDialog();
    Object.assign(showResult, {
      questionName:this.question.name,
      step:this.question.step,
      takenSteps:this.clear,
    });
    const contents = [showResult];

    if(next){
      if(next.chapter.id !== this.chapterId){
        buttons.push({label:"次のチャプターへ", action:e=>{
          router.back(true);
          router.replace("/select-question", {chapterId:next.chapter.id});
        }});
      }
      else{
        buttons.push({label:"次の問題へ", action:e=>{
          router.replace("/question", {chapterQuestion:{
            chapterId:next.chapter.id,
            questionId:next.question.id,
          }})
        }})
      }
    }
    else{
      const copyButtons = [...buttons];
      buttons.push({label:"次の問題へ", action:e=>{
        router.openDialog({
          title:"お知らせ",
          content:html`
            <div style="display:grid;place-items:center;height:100%;box-sizing:border-box;padding:1rem 1rem">
              <div>
                次の問題はありません。<br>
                次回更新をお待ちください。
              </div>
            </div>
          `,
          buttons:[
            ...copyButtons,
            {label:"タイトルへ戻る", action:e=>{
              router.open("/");
            }},
          ],
        });
        return true;
      }})
    }

    router.openDialog({title:"クリア", content: contents, buttons});
  }

  render(){
    if(!this.question) return;
    return html`
    <layout-main bar-title=${this.question.name} .back=${true}>
      <elem-question id=q .pattern=${this.question.pattern} .start=${this.question.start}
        @flip=${e=>{
          this.currentStep+=1;
          this.beforeClick = {x:e.detail.x, y:e.detail.y};
        }}
        @clear=${e=>{
          if(!this.clear){
            this.clear = this.currentStep;
            window.setTimeout(()=>{
              this.#showClearDialog();
            }, 300);
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
              this.#reset();
            }}
            >
            パネル<br>リセット
          </button>
          <elem-status
            .step=${this.question.step}
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
}
customElements.define("page-question", QuestionPage);
export default QuestionPage;