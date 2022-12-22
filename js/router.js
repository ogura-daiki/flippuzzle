import { html, css, when, guard } from "./Lit.js";
import BaseElement from "./BaseElement.js";
import "./element/Dialog.js";
import { colors } from "./baseTheme.js";

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
  constructor(){
    super();
    window.addEventListener("popstate", e=>{
      const page = this.renderRoot.querySelector("#page");
      if(page.beforePopState){
        const result = page.beforePopState();
        if(result instanceof Promise){
          result.then(result=>{
            if(!result){
              this.#changeState();
            }
          });
        }
        else if(result){
          this.#changeState();
        }
        return;
      }
      this.#changeState();
    });
  }
  #changeState(){
    if(!history.state){
      this.open("/");
    }
    const {path, args, dialog} = history.state;
    this.route = {path, args};
    this.dialog = dialogState.get(dialog);
  }
  #routes = [];
  setRoute(path, component){
    this.#routes.push({path, component});
  }
  open(path, args={}){
    history.pushState({path, args}, null);
    this.#changeState();
  }
  back(){
    history.back()
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
  openDialog({title, content, buttons=[{label:"閉じる",action:()=>router.closeDialog()}]}){
    dialogState.set(dialogStateId, {title, content, buttons});
    history.replaceState({...history.state, dialog:dialogStateId}, null);
    this.dialog = {title, content, buttons};
    dialogStateId += 1;
  }
  closeDialog(){
    history.replaceState({...history.state, dialog:-1}, null);
    this.dialog = null;
  }
  render(){
    if(!this.route) return;
    return html`
    <div class="fill">
      <div class="fill">
        ${guard([this.route], ()=>this.#renderPage())}
      </div>
      ${when(
        this.dialog,
        ()=>html`
        <div class="fill backdrop">
          <elem-dialog .title=${this.dialog.title} .content=${this.dialog.content} .buttons=${this.dialog.buttons}></elem-dialog>
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