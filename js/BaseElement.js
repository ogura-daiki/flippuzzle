import { LitElement } from "./Lit.js";
import common from "./style/common.js";
import IconFonts from "./style/IconFonts.js";

class BaseElement extends LitElement {
  static get styles(){
    return [IconFonts, common];
  }
}

export default BaseElement;