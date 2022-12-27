import { until } from "../Lit.js";

const delayHide = (hide, delay, func) => until(
  hide
    ? new Promise(r => setTimeout(r, delay))
    : func()
);

export { delayHide };