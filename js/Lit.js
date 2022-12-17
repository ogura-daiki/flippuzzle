import * as Lit from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import IconFonts from "./style/IconFonts.js";

class BaseElement extends Lit.LitElement {
  static get styles(){
    return [IconFonts];
  }
}

const {LitElement, html, css, until, when, guard } = Lit;

export {LitElement, BaseElement, html, css, until, when, guard };
