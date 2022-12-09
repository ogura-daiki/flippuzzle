import {LitElement, html, css} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";

class Router extends LitElement {
  static get properties(){
    return {
      route:{type:Object},
    }
  }
  static get styles(){
    return css`
    :host{
      display:contents:
    }
    `;
  }
  #routes = [];
  setRoute(path, component){
    this.#routes.push({path, component});
  }
  open(path, args={}){
    this.route = {path, args};
  }
  render(){
    if(!this.route) return;
    const currentRoute = this.#routes.find(route=>route.path===this.route.path);
    if(!currentRoute) return;
    const page = new currentRoute.component();
    Object.entries(this.route.args).forEach(([key,value])=>{
      page[key] = value;
    });
    return html`${page}`;
  }
}
customElements.define("app-router", Router);
export default Router;