import { html, css, when, guard } from "./Lit.js";
import BaseElement from "./BaseElement.js";
import "./element/Dialog.js";
import { colors } from "./baseTheme.js";
import LocalHistory from "./libs/LocalHistory.js";

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
    this.#localHistory.pop(force);
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
  logHistory(){
    this.#localHistory.logHistory();
  }
  openDialog({title, content, buttons=[{label:"閉じる",action:()=>router.closeDialog()}], onClose=()=>{}}){
    this.renderRoot.querySelector("#dialog")?.onClose();
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
      <div class="fill">
        ${guard([this.route.path, this.route.args], ()=>this.#renderPage())}
      </div>
      ${when(
        this.dialog,
        ()=>html`
        <div class="fill backdrop">
          <elem-dialog id=dialog .title=${this.dialog.title} .content=${this.dialog.content} .buttons=${this.dialog.buttons} .onClose=${this.dialog.onClose}></elem-dialog>
        </div>
        `,
      )}
    </div>`;
  }
  updated(){
  }
}
customElements.define("app-router", Router);
export default Router;