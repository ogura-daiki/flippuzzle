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
    z-index:1;
  }
  #contents{
    display:block;
    flex-grow:1;
    overflow-y:auto;
    z-index:0;
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

  #menu-container{
    height:100%;
    aspect-ratio:1;
    margin-left:auto;
    position:relative;
    overflow:visible;
  }
  #menu-icon{
    height:100%;
    aspect-ratio:1;
    display:grid;
    place-items:center;
    font-size:1.75rem;
    margin-left:auto;
  }
  #menulist{
    background:${colors.background.base};
    color:${colors.background.text};
    min-width:8rem;
    max-width:calc(100vw - 2rem);
    padding:.6rem .0rem;
    display:flex;
    flex-flow:column nowrap;
    position:absolute;
    top:0px;
    right:0px;
    margin:1rem;
    font-size:1rem;
    border-radius:.4rem;
    box-shadow:0px 0px .5rem .1rem ${colors.background.onBase.a(0.2)};
  }
  #menulist .menuitem{
    padding:.4rem .8rem;
    text-overflow:ellipsis;
    overflow:hidden;
    white-space:nowrap;
  }
`;

class MainLayout extends BaseElement {
  static get properties(){
    return {
      barTitle:{type:String, attribute:"bar-title"},
      back:{type:Object},
      menu:{type:Array},
      menuOpen:{type:Boolean},
    }
  }
  constructor(){
    super();
    this.back = false;
    this.barTitle = "FlipPuzzle";
    this.menuOpen = false;
  }
  static get styles(){
    return [super.styles, style];
  }
  openMenu(){
    this.menuOpen = true;
  }
  render(){
    return html`
    <div id=container @click=${e=>{
      if(e.target.id !== "menu-icon"){
        this.menuOpen = false;
      }
    }}>
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
        ${when(this.menu, ()=>html`
          <div id=menu-container>
            <i id=menu-icon @click=${e=>{
              this.openMenu();
            }}>more_vert</i>
            ${when(this.menuOpen, ()=>html`
              <div id=menulist>
                ${this.menu.map(({label, action})=>html`
                  <div class=menuitem @click=${e=>action()}>${label}</div>
                `)}
              </div>
            `)}
          </div>
        `)}
      </div>
      <slot id=contents></slot>
    </div>
    `;
  }
}
customElements.define("layout-main", MainLayout);