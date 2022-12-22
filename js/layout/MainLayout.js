import {html, css, when} from "../Lit.js";
import BaseElement from "../BaseElement.js";
import { colors } from "../baseTheme.js";

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
    box-shadow:0px 0px .5rem .1rem ${colors.background.onBase.a(0.3)};
  }
  #contents{
    display:block;
    flex-grow:1;
    overflow-y:auto;
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

class MainLayout extends BaseElement {
  static get properties(){
    return {
      barTitle:{type:String, attribute:"bar-title"},
      back:{type:Object},
    }
  }
  constructor(){
    super();
    this.back = false;
    this.barTitle = "FlipPuzzle";
  }
  static get styles(){
    return [super.styles, style];
  }
  render(){
    return html`
    <div id=container>
      <div id=appbar>
        <i
          id=back
          @click=${e=>{
            if(this.back === true){
              router.back();
              return;
            }
            this.back();
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