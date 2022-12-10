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
  updated(){
  }
}
customElements.define("app-router", Router);
export default Router;