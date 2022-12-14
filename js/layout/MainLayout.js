import {LitElement, html, css, when} from "https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js";
import { colors } from "../baseTheme.js";
import IconFonts from "../style/IconFonts.js";

const style = css`
  :host{
    display:contents;
  }
  #container{
    width:100%;
    height:100%;
    display:flex;
    flex-flow:column nowrap;
    background:${colors.background.base};
  }
  #appbar{
    background:${colors.primary.base};
    color:${colors.primary.text};
    font-size:1.75rem;
    height:fit-content;
    user-select:none;
    display:flex;
    flex-flow:row nowrap;
    box-shadow:0px 0px .5rem .1rem rgba(0,0,0,.3);
  }
  #contents{
    display:block;
    flex-grow:1;
    overflow-y:auto;
  }
  #contents::-webkit-scrollbar {
    width:.5rem;
    height:.5rem;
  }
  #contents::-webkit-scrollbar-track {
    width:.5rem;
    height:.5rem;
    background:rgba(128,128,128,.3);
  }
  #contents::-webkit-scrollbar-thumb {
    width:.5rem;
    height:.5rem;
    background:rgba(128,128,128,.4);
  }
  #title{
    display:block;
    padding:8px 16px;
  }
  #title.back{
    padding-left:0px;
  }

  #back{
    height:100%;
    aspect-ratio:1;
    display:grid;
    place-items:center;
    font-size:1.75rem;
  }
`;

class MainLayout extends LitElement {
  static get properties(){
    return {
      barTitle:{type:String, attribute:"bar-title"},
      back:{type:Boolean},
    }
  }
  constructor(){
    super();
    this.back = false;
    this.barTitle = "FlipPuzzle";
  }
  static get styles(){
    return [style, IconFonts];
  }
  render(){
    return html`
    <div id=container>
      <div id=appbar>
        <i
          id=back
          @click=${e=>{
            router.back();
          }}
          style="${when(!this.back,()=>`
            display:block;
            width:0px;
            overflow:hidden;
          `)}"
          >
          arrow_back
        </i>
        <span id=title class="${when(this.back, ()=>"back")}">${this.barTitle}</span>
      </div>
      <slot id=contents></slot>
    </div>
    `;
  }
}
customElements.define("layout-main", MainLayout);