
const PromiseCache = (func) => {
  let promise;
  return ()=>{
    if(!promise){
      promise = func();
    }
    return promise;
  }
}
const waitPromise = (wait, promise) => new Promise(r=>setTimeout(()=>r(), wait)).then(()=>promise);

export {PromiseCache, waitPromise};