import {LitElement, html, css, when, guard } from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import "./element/Dialog.js";

let dialogStateId = 0;
const dialogState = new Map();

class Router extends LitElement {
  static get properties(){
    return {
      route:{type:Object},
      dialog:{type:Object},
      root:{state:true},
    }
  }
  static get styles(){
    return css`
    :host{
      display:contents:
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
      background:rgba(0,0,0,.2);
      box-sizing:border-box;
      padding:32px;
      overflow:hidden;
      display:grid;
      place-items:center;
    }
    `;
  }
  constructor(){
    super();
    window.addEventListener("popstate", e=>{
      this.#changeState();
    });
  }
  #changeState(){
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
    Object.entries(this.route.args).forEach(([key,value])=>{
      page[key] = value;
    });
    return page;
  }
  openDialog({title, content}){
    dialogState.set(dialogStateId, {title, content});
    history.replaceState({...history.state, dialog:dialogStateId}, null);
    this.dialog = {title, content};
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
          <elem-dialog .title=${this.dialog.title} .content=${this.dialog.content}></elem-dialog>
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