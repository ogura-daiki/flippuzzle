import {LitElement, html, css, when } from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import sound from "../sound.js";
import chapters from "../../questions/index.js";
import QuestionResultDialog from "./dialog/QuestionResultDialog.js";

class QuestionPage extends LitElement{
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
    return css`
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

  render(){
    if(!this.question) return;
    return html`
    <layout-main back bar-title=${this.question.name}>
      <elem-question id=q .pattern=${this.question.pattern} .start=${this.question.start}
        @flip=${e=>{
          this.currentStep+=1;
          this.beforeClick = {x:e.detail.x, y:e.detail.y};
        }}
        @clear=${e=>{
          if(!this.clear){
            this.clear = this.currentStep;

            const next = this.#findNextQuestion();
            const buttons = [
              {label:"もう一度", action:e=>{
                router.closeDialog();
                this.#reset();
              }},
              {label:"問題選択に", action:e=>{
                router.closeDialog();
                router.open("/select-question", {chapterId:this.chapterId});
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
                  router.closeDialog();
                  router.open("/select-question", {chapterId:next.chapter.id});
                }});
              }
              else{
                buttons.push({label:"次の問題へ", action:e=>{
                  router.closeDialog();
                  router.open("/question", {chapterQuestion:{
                    chapterId:next.chapter.id,
                    questionId:next.question.id,
                  }})
                }})
              }
            }
            else{
              buttons.push({label:"次の問題へ", action:e=>{
                router.openDialog({title:"お知らせ", content:html`
                  <div style="display:grid;place-items:center;height:100%;box-sizing:border-box;padding:1rem 1rem">
                    <div>
                      次の問題はありません。<br>
                      次回更新をお待ちください。
                    </div>
                  </div>
                `, buttons:[
                  {label:"タイトルへ戻る", action:e=>{
                    router.closeDialog();
                    router.open("/");
                  }},
                ]});
              }})
            }

            router.openDialog({title:"クリア", content: contents, buttons});
          }
        }}
        @reset=${e=>{
          //sound.reset.play();
        }}
      >
        <div id=menu slot=menu>
          <button
            @click=${e=>{
              this.#reset();
            }}
            >
            パネル<br>リセット
          </button>
          <div id=status>
            <div>生成手数：${this.question.step}手</div>
            <div>${when(
              this.clear,
              ()=>html`クリア(${this.clear}手)`,
              ()=>when(
                this.currentStep <= this.question.step,
                ()=>html`残り：${this.question.step - this.currentStep}手`,
                ()=>html`${this.currentStep - this.question.step}手オーバー`,
              )
            )}</div>
            <div>
              前回：${when(this.beforeClick,()=>`${this.beforeClick.y+1},${this.beforeClick.x+1}`, ()=>`-,-`)}
            </div>
          </div>
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