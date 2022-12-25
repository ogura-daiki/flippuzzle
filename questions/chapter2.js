const frontAll = [...Array(4)].map(()=>Array(4).fill(0));
const backAll = [...Array(4)].map(()=>Array(4).fill(1));
//テンプレートタグ、改行で分割して前後の余白を除去し１文字ずつに分割して数値に変換
const fromStr = (str) => str[0].split("\n").map(v=>v.trim()).filter(v=>v).map(v=>[...v.trim()].map(v=>+v));

export default [
  {
    id:"s1-1",
    name:"simple1-1",
    step:1,
    start:fromStr`
      1111
      0011
      0101
      1001
    `,
    pattern:fromStr`
      1000
      0100
      0010
      1001
    `,
  },
  {
    id:"s1-2",
    name:"simple1-2",
    step:1,
    start:fromStr`
      1011
      1011
      0100
      0011
    `,
    pattern:fromStr`
      1100
      1100
      0011
      0011
    `,
  },
  {
    id:"s1-3",
    name:"simple1-3",
    step:1,
    start:fromStr`
      1110
      1101
      1001
      0111
    `,
    pattern:fromStr`
      1110
      1010
      1110
      0000
    `,
  },
  {
    id:"s1-4",
    name:"simple1-4",
    step:2,
    start:fromStr`
      0100
      0100
      0100
      0111
    `,
    pattern:fromStr`
      1011
      1011
      1000
      0111
    `,
  },
  {
    id:"s1-5",
    name:"simple1-5",
    step:2,
    start:fromStr`
      0110
      1011
      0101
      0010
    `,
    pattern:fromStr`
      0110
      0111
      0111
      0000
    `,
  },
  {
    id:"s1-6",
    name:"simple1-6",
    step:2,
    start:fromStr`
      1110
      1001
      1001
      0111
    `,
    pattern:fromStr`
      0010
      0101
      1010
      0100
    `,
  },
  {
    id:"s1-7",
    name:"simple1-7",
    step:2,
    start:fromStr`
      0000
      0011
      0100
      0100
    `,
    pattern:fromStr`
      0111
      1000
      1000
      1000
    `,
  },
  {
    id:"s1-8",
    name:"simple1-8",
    step:4,
    start:fromStr`
      0000
      1111
      1000
      1000
    `,
    pattern:fromStr`
      0100
      0100
      0100
      0111
    `,
  },
];