import {LitElement, html, css} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";


class FreePlayPage extends LitElement{
  constructor(){
    super();
  }
  render(){
    return html`
    <layout-main back bar-title="練習モード">
      <page-question></page-question>
    </layout-main>
    `;
  }
}
customElements.define("free-play", FreePlayPage);
export default FreePlayPage;