import { color } from "./libs/colorHelper.js";

const colors = {
  background: {
    base: color`rgb(255,230,200)`,
    onBase: color`#000`,
    text: color`#000`,
  },
  primary: {
    base: color`rgb(100,50,0)`,
    onBase: color`rgb(150,75,0)`,
    text: color`#FFF`,
  },
  secondary: {
    base: color`rgb(130,90,40)`,
    onBase: color`rgb(150,110,50)`,
    text: color`#FFF`,
  },
};

console.log(colors.background.base, colors.background.base+"");
console.log(colors.background.base.a(0.5), colors.background.base.a(0.5)+"");

export {colors};