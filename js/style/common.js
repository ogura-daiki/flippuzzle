import {css} from "../Lit.js";
import { colors } from "../baseTheme.js";

export default css`

.col, .row, .centering{
  display:flex;
  gap:.5rem;
}
.col{
  flex-direction: column;
}
.row{
  flex-direction: row;
}
.centering{
  place-content:center;
  place-items:center;
}
:is(.col, .row, .centering).inline{
  display:inline-flex;
}
:is(.col, .row, .centering).wrap{
  flex-wrap:wrap;
}
.grow{
  flex-grow:1;
  flex-basis:0px;
}

.gap-0 { gap:0px }
.gap-1 { gap:1rem }

.button{
  background-color:${colors.secondary.base};
  color:${colors.secondary.text};
  font-size:1rem;
  border:none;
  border-radius:.2rem;
  box-shadow:1px 2px 4px 1px ${colors.background.onBase.a(0.2)};
}
.checkbox{
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48;
  user-select:none;
  
  width:1.2rem;
  height:1.2rem;
  appearance:none;
  display:block;
  margin:.1rem .3rem .1rem .1rem;
}

.checkbox:before{
  content:"";
  display:block;
  background-color:${colors.secondary.base};
  opacity:.5;
  color:${colors.secondary.text};
  border-radius:.1rem;
  font-size:1.2rem;
  width:100%;
  height:100%;
}
.checkbox:checked:before{
  content:"done";
  opacity:1;
}

*::-webkit-scrollbar {
  width:.5rem;
  height:.5rem;
}
*::-webkit-scrollbar-track {
  width:.5rem;
  height:.5rem;
  background:${colors.background.onBase.a(0.2)};
}
*::-webkit-scrollbar-thumb {
  width:.5rem;
  height:.5rem;
  background:${colors.background.onBase.a(0.2)};
}
`;