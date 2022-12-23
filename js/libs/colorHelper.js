import { css } from "../Lit.js";

const appendMethods = (obj, methods) => {
  Object.entries(methods).forEach(([name, func]) => {
    Object.defineProperty(obj, name, {
      writable: false,
      value: func,
    });
  });
}

const pack = (...args) => {
  const strs = args[0];
  const vals = args.slice(1);
  let str = "";
  for (let idx = 0; idx < vals.length; idx += 1) {
    str += strs[idx];
    str += vals[idx];
  }
  str += strs[vals.length];
  return str;
}

const isColorCode = /^#([a-fA-F0-9]{3}){1,2}([a-fA-F0-9]{1,2})?$/;
const isRGBFunc = (() => {
  const num = String.raw`\s*\d+\s*`;
  const smallNum = String.raw`\s*\d*\.?\d+\s*`;
  return new RegExp(String.raw`^rgba?\(${num},${num},${num}(,${smallNum})?\)$`);
})();

const patterns = [
  {
    //テンプレートタグ関数として使用された場合
    cond: (strs, ...vals) => (
      strs instanceof Array
      && strs.raw instanceof Array
      && strs.every(v => typeof v === "string")
      && strs.raw?.every(v => typeof v === "string")
      && vals.length === strs.length-1
    ),
    proc: (...args) => {
      const str = pack(...args);
      //16進カラーコード
      if (isColorCode.test(str)) {
        let color = str.slice(1);
        //カラーコードの桁数が3桁未満のとき解析に失敗
        if (color.length < 3) {
          throw new Error();
        }
        //各2桁のカラーコードでないとき、各２桁に整形する
        if (color.length < 6) {
          color = [...color].map(s => s + s).join("");
        }
        //2桁ごとに16進数を数値に変換
        const list = [...Array(Math.floor(color.length / 2))].map((_,i) => parseInt(color.slice(i*2,(i+1)*2), 16));
        //アルファ値を0～1に調整
        if (list[3] !== undefined) {
          list[3] /= 255;
        }
        return list;
      }
      //rgb関数、rgba関数
      else if (isRGBFunc.test(str)) {
        const list = [...str.matchAll(/\d*\.?\d+/g)].map(v => +v[0]);
        if (list.length < 4) {
          list.push(1);
        }
        return list;
      }
    }
  },
  {
    //数値が複数渡された場合
    cond: (r,g,b,a=1)=>[r,g,b,a].every(v => typeof v === "number"),
    proc:(r,g,b,a=1)=>[r,g,b,a],
  },
  {
    //{r,g,b,a}のようなオブジェクトが渡された場合
    cond:({r,g,b,a=1})=>([r,g,b,a].every(v=>typeof v === "number")),
    proc:({r,g,b,a=1})=>[r,g,b,a],
  },
];

const parseArgs = (args) => {
  const target = patterns.find(p=>p.cond(...args));
  return target.proc(...args);
}

const color = (...args) => {
  const paramNames = [..."rgba"];
  const params = {
    r: 0, g: 0, b: 0, a: 1,
  };

  const assignParamList = ([r,g,b,a=1]) => Object.entries({r,g,b,a}).forEach(([name, value]) => params[name] = value);

  //rgbaが順に入った配列
  const list = parseArgs(args);
  assignParamList(list);

  const arr = [`rgba(${paramNames.map(name => params[name]).join(",")})`];
  arr.raw = arr;
  const obj = css(arr);

  const methods = {
    red: v => color({ ...params, r: v }),
    green: v => color({ ...params, g: v }),
    blue: v => color({ ...params, b: v }),
    alpha: v => color({ ...params, a: v }),
  };
  methods.r = methods.red;
  methods.g = methods.green;
  methods.b = methods.blue;
  methods.a = methods.alpha;

  appendMethods(obj, methods);

  return obj;
}

export {color};