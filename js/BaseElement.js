import { LitElement } from "./Lit.js";
import IconFonts from "./style/IconFonts.js";

class BaseElement extends LitElement {
  static get styles(){
    return [IconFonts];
  }
}

export default BaseElement;