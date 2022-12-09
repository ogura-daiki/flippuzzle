
const range = (...vals) => {
  if(vals.length===1){
    return range(0,vals);
  }
  const [start, end] = vals;
  return [... Array(end-start)].map((_,i)=>i+start);
}
const clamp = (min, v, max) => Math.max(min, Math.min(v, max));
const boardToHash = (board) => board.map(row=>row.map(v=>v?1:0).join(",")).join("|");

export {range, clamp, boardToHash};