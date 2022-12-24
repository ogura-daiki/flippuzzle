import { html, css } from "../../Lit.js";

const style = css`
#text{
  padding:1rem;
  box-sizing:border-box;
  width:100%;
  display:block;
  white-space:pre-wrap;
}
#board{
  margin: 1rem auto;
  width:16rem;
  height:16rem;
  --panel-width:4rem;
  white-space:nowrap;
}
.midashi{
  display:inline-block;
  font-size:1.2rem;
  padding:.2rem 0px;
}
`;
export default html`
<style>${style}</style>
<pre id=text>
<span class=midashi>これは何？</span>
これはパズルゲームです。

<span class=midashi>遊び方</span>
画面の上下にパネルの集まりが表示されます。

上側（または左側）がお手本となる模様で、
下側（または右側）のパネルを操作することができます。

パネルを押すと、押したパネルと、その周りにあるパネル８枚が回転し、色が変わります。
このパネルを操作して、お手本の模様を完成させるとクリアです。

<span class=midashi>パネル見本</span>
実際に操作できます。
<flip-board id=board></flip-board>
</pre>
`;