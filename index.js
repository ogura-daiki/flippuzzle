import "./js/element/FlipBoard.js";
import QuestionPage from "./js/page/Question.js";
import StartPage from "./js/page/StartPage.js";
import Router from "./js/router.js";

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

const router = new Router();
window.router = router;

if(isLocalhost){
  router.root = "";
}
else{
  router.root = "/flippuzzle";
}

router.setRoute("/", StartPage);
router.setRoute("/free-play", QuestionPage);
router.open("/");


document.body.append(router);
