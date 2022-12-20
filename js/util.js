
const range = (...vals) => {
  if(vals.length===1){
    return range(0,vals);
  }
  const [start, end] = vals;
  return [... Array(end-start)].map((_,i)=>i+start);
}
const clamp = (min, v, max) => Math.max(min, Math.min(v, max));
const boardToHash = (board) => board.map(row=>row.map(v=>v?1:0).join(",")).join("|");

const flipBoard = (board, {x, y}) => {
  for(let iy = clamp(0, y-1, board.length); iy < Math.min(y+2, board.length); iy+=1){
    for(let ix = clamp(0, x-1, board[0].length); ix < Math.min(x+2, board[0].length); ix+=1){
      board[iy][ix] = !board[iy][ix];
    }
  }
}

export {range, clamp, boardToHash, flipBoard};