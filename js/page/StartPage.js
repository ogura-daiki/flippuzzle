import {LitElement, html, css} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";

class StartPage extends LitElement{
  constructor(){
    super();
  }
  static get styles(){
    return css`
    :host{
      display:contents;
    }
    #container{
      display:flex;
      flex-flow:column nowrap;
      width:100%;
      height:100%;
      padding:16px;
      gap:16px;
      box-sizing:border-box;
    }
    #wrapper{
      width:100%;
      flex-basis:0px;
      flex-grow:1;
      position:relative;
    }
    #icon{
      width:100%;
      height:100%;
      position:absolute;
      top:0px;
      left:0px;
      display:block;
      object-fit:contain;
    }
    `;
  }
  render(){
    return html`
    <div id=container>
      <div id=wrapper>
        <img id=icon src="./images/icons/icon256.png">
      </div>
      <button @click=${e=>router.open("/free-play", {test:1})}>練習モード</button>
      <button @click=${e=>alert("工事中")}>問題を解く</button>
    </div>
    `;
  }
}
customElements.define("start-page", StartPage);
export default StartPage;