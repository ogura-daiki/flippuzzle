import "./js/layout/MainLayout.js";
import "./js/element/FlipBoard.js";
import "./js/element/Question.js";
import "./js/element/Status.js";
import StartPage from "./js/page/StartPage.js";
import FreePlayPage from "./js/page/FreePlay.js";
import Router from "./js/router.js";
import IconFonts from "./js/style/IconFonts.js";
import SelectChapterPage from "./js/page/SelectChapter.js";
import SelectQuestionPage from "./js/page/SelectQuestion.js";
import QuestionPage from "./js/page/Question.js";

if(!isLocalhost){
  //開発者メニューが開かれることを妨害する
  document.addEventListener('keydown',(e) => {
    if (e.key === "F12" || (e.ctrlKey && e.key==="I")) { // F12キー
      e.preventDefault();
    }
  });
  document.addEventListener('contextmenu',(e) => {
    e.preventDefault();
  });
}

document.head.append(Object.assign(document.createElement("style"), {textContent:IconFonts}));

const router = new Router();
if(isLocalhost){
  router.root = location.origin;
}
else{
  router.root = "https://ogura-daiki.github.io/flippuzzle"
}

window.router = router;

router.setRoute("/", StartPage);
router.setRoute("/free-play", FreePlayPage);
router.setRoute("/select-chapter", SelectChapterPage);
router.setRoute("/select-question", SelectQuestionPage);
router.setRoute("/question", QuestionPage);
router.open("/");


document.body.append(router);
