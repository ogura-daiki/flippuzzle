import {LitElement, html, css} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";


class FreePlayPage extends LitElement{
  constructor(){
    super();
  }
  static get styles(){
    return css`
    #q button{
      padding:0.5rem 1rem;
      font-size:1rem;
    }
    `
  }
  render(){
    return html`
    <layout-main back bar-title="練習モード">
      <elem-question id=q>
        <button
          slot=menu
          @click=${e=>{
            this.renderRoot.querySelector("#q").resetBoardIfNeeded()
          }}
        >リセット</button>
      </elem-question>
    </layout-main>
    `;
  }
}
customElements.define("free-play", FreePlayPage);
export default FreePlayPage;