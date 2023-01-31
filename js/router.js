import { html, css, when, guard, until } from "./Lit.js";
import BaseElement from "./BaseElement.js";
import "./element/Dialog.js";
import { colors } from "./baseTheme.js";
import LocalHistory from "https://ogura-daiki.github.io/LocalHistory/LocalHistory.js";
import { delayHide } from "./libs/TemplateHelper.js";

let dialogStateId = 0;
const dialogState = new Map();


const style = css`
:host{
  display:contents;
  user-select:none;
}
.fill{
  width:100%;
  height:100%;
  position:relative;
}
.backdrop{
  position:absolute;
  top:0px;
  left:0px;
  background:${colors.background.onBase.a(0.2)};
  box-sizing:border-box;
  padding:32px;
  overflow:hidden;
  display:grid;
  place-items:center;
}
elem-dialog{
  box-shadow: 0px 0px 4rem 1rem ${colors.background.onBase.a(0.3)};
}

#pageContainer{
  z-index:0;
}
#dialogContainer{
  z-index:1;
  pointer-events:none;
  opacity:0;
  transition:opacity .1s;
}
#dialogContainer.show{
  pointer-events:auto;
  opacity:1;
}
#dialogContainer.hide{
}
`;

class Router extends BaseElement {
  static get properties(){
    return {
      route:{type:Object},
      dialog:{type:Object},
      root:{state:true},
    }
  }
  static get styles(){
    return [super.styles, style];
  }

  #localHistory = new LocalHistory();
  constructor(){
    super();

    this.#localHistory.addBeforePopStateListener((isForward)=>{
      const page = this.renderRoot.querySelector("#page");
      if(page.beforePopState){
        return page.beforePopState(isForward);
      }
      return true;
    });
    this.#localHistory.addOnChangeListener(data=>{
      this.#changeState(data);
    });
  }
  #changeState(data){
    if(!data){
      this.open("/");
      return;
    }
    const {path, args, dialog} = data;
    this.route = {path, args};
    this.dialog = dialogState.get(dialog);
  }
  #routes = [];
  setRoute(path, component){
    this.#routes.push({path, component});
  }
  open(path, args={}){
    this.#localHistory.push({path, args});
  }
  replace(path, args={}){
    this.#localHistory.replace(data=>{
      return {path, args};
    });
  }
  back(force=false){
    this.#localHistory.back(force);
  }
  canBack(){
    return this.#localHistory.canBack();
  }
  #renderPage(){
    const currentRoute = this.#routes.find(route=>route.path===this.route.path);
    if(!currentRoute) return;
    const page = new currentRoute.component();
    page.setAttribute("id", "page");
    Object.entries(this.route.args).forEach(([key,value])=>{
      page[key] = value;
    });
    return page;
  }
  openDialog({title, content, buttons=[{label:"閉じる",action:()=>router.closeDialog()}], onClose=()=>{}}){
    this.dialog?.onClose();
    dialogState.set(dialogStateId, {title, content, buttons, onClose});

    this.#localHistory.replace(data=>{
      data.dialog = dialogStateId;
      return data;
    });
    dialogStateId += 1;
  }
  closeDialog(){
    this.renderRoot.querySelector("#dialog")?.onClose();
    this.#localHistory.replace(data=>{
      data.dialog = -1;
      return data;
    });
  }
  render(){
    if(!this.route) return;
    return html`
    <div class="fill">
      <div id=pageContainer class="fill">
        ${guard([this.route.path, this.route.args], ()=>this.#renderPage())}
      </div>
      <div id=dialogContainer class="fill backdrop ${this.dialog?"show":"hide"}">
      ${delayHide(
        !this.dialog, 100,
        ()=> html`
          <elem-dialog id=dialog
            .title=${this.dialog.title}
            .content=${this.dialog.content}
            .buttons=${this.dialog.buttons}
            .onClose=${this.dialog.onClose}
          ></elem-dialog>
        `
      )}
      </div>
    </div>`;
  }
  updated(){
  }
}
customElements.define("app-router", Router);
export default Router;