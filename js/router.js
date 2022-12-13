import {LitElement, html, css, when, guard } from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import "./element/Dialog.js";

class Router extends LitElement {
  static get properties(){
    return {
      route:{type:Object},
      dialog:{type:Object},
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
    window.addEventListener("hashchange", e=>{
      const route = location.hash.replace(/^#/,"");
      const path = route.split("?data=")[0];
      const args = JSON.parse(decodeURI(route.split("?data=")[1]));
      this.route = {path, args};
    });
  }
  #routes = [];
  setRoute(path, component){
    this.#routes.push({path, component});
  }
  open(path, args={}){
    this.route = {path, args};
    location.hash = `${path}?data=${encodeURI(JSON.stringify(args))}`;
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
    this.dialog = {title, content};
  }
  closeDialog(){
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