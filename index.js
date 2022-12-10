import "./js/layout/MainLayout.js";
import "./js/element/FlipBoard.js";
import "./js/element/Question.js";
import StartPage from "./js/page/StartPage.js";
import FreePlayPage from "./js/page/FreePlay.js";
import Router from "./js/router.js";
import IconFonts from "./js/style/IconFonts.js";

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
window.router = router;

router.setRoute("/", StartPage);
router.setRoute("/free-play", FreePlayPage);
router.open("/");


document.body.append(router);
