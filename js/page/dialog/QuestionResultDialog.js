import {LitElement, html, css } from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import { colors } from "../../baseTheme.js";
import sound from "../../sound.js";
import IconFonts from "../../style/IconFonts.js";


const style = css`
:host{
  display:contents;
}
`;

class QuestionResultDialog extends LitElement {
  static get properties(){
    return {

    };
  }
  static get styles(){
    return [style, IconFonts];
  }
  constructor(){
    super();
  }

  render(){
    return html`
    スコアを表示
    `;
  }
}
customElements.define("dialog-question-result", QuestionResultDialog);

export default QuestionResultDialog;