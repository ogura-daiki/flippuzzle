import { colors } from "../baseTheme.js";
import { html, render } from "../Lit.js";

const make = (name, attr) => {
  const elem = document.createElement(name);
  return Object.assign(elem, attr);
}

document.head.append(make("style", {
  textContent:`
    .snackbar_layout{
      display:grid;
      place-items:center;
      position:fixed;
      bottom:1rem;
      left:1rem;
      width:calc(100vw - 2rem);
      opacity:0;
      transition:opacity .5s;
    }
    .snackbar_layout.in{
      opacity:1;
    }
    .snackbar_layout.out{
      pointer-events:none;
    }
    .snackbar_container{
      background:${colors.primary.base.a(0.8)};
      color:${colors.primary.text};
      border-radius:.5rem;
      box-shadow:1px 2px 4px 1px ${colors.background.onBase.a(0.2)};
      padding:.4rem .8rem;
      overflow-wrap:anywhere;
      user-select:none;
      text-overflow:ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 5;
      overflow:hidden;
    }
  `
}));

class SnackBar {
  constructor(message, buttons=[]){
    this.message = message;
    this.buttons = buttons;
  }
  show(duration){
    const container = make("div", {className:"snackbar_layout"});
    const close = ()=>{
      container.classList.remove("in");
      container.classList.add("out");
      setTimeout(()=>{
        container.remove();
      }, 500)
    }
    render(html`
    <div class="snackbar_container" @click=${close}>
      ${this.message}
    </div>
    `, container);
    document.body.append(container);

    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        container.classList.add("in");
      });
    });

    setTimeout(close, duration);
  }
}

export default SnackBar;