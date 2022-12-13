import {LitElement, html, css} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import IconFonts from "../style/IconFonts.js";

const style = css`
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
  flex-grow:2;
  position:relative;
  display:grid;
  place-items:center;
}
#icon{
  max-width:100%;
  height:100%;
  display:block;
  object-fit:contain;
}
#buttons{
  display:flex;
  flex-flow:column nowrap;
  flex-basis:0px;
  flex-grow:1;
  gap:1rem;
  justify-content:center;
}
#buttons button{
  height:4rem;
  padding: 0.5rem 1rem;
  font-size:1rem;
}
`;
class StartPage extends LitElement{
  constructor(){
    super();
  }
  static get styles(){
    return [style, IconFonts];
  }
  render(){
    return html`
    <layout-main bar-title="FlipPuzzle">
      <div id=container>
        <div id=wrapper>
          <img id=icon src="./images/icons/icon256.png">
        </div>
        <div id=buttons>
          <button @click=${e=>router.open("/free-play", {test:1})}>練習モード</button>
          <button @click=${e=>router.openDialog({title:"工事中", content:html`鋭意製作中です`})}>問題を解く</button>
        </div>
      </div>
    </layout-main>
    `;
  }
}
customElements.define("start-page", StartPage);
export default StartPage;