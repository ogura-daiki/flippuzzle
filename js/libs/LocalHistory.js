
class LocalHistory {

  #historyList = [];
  #historyId = 0;
  #getCurrentHistory(){
    return this.#historyList[this.#historyList.length-1];
  }
  push(data){
    const historyData = {id:this.#historyId, data};
    this.#historyList.push(historyData);
    history.pushState(this.#historyId, null);
    this.#historyId += 1;
    this.#onChange(data);
  }
  pop(force){
    if(force){
      this.#forceBack();
      this.#onChange(this.#getCurrentHistory().data);
      return;
    }
    history.back();
  }
  #force = false;
  #forceBack(){
    this.#historyList.pop();
    this.#force = true;
    history.back();
  }
  replace(replacer){
    const currentHistory = this.#getCurrentHistory();
    const replaced = replacer(currentHistory.data);
    currentHistory.data = replaced;
    this.#onChange(replaced);
  }
  #findHistoryById(id){
    if(typeof id !== "number"){
      return null;
    }
    for(let idx = this.#historyList.length-1; idx>=0; idx+=1){
      const targetHistory = this.#historyList[idx];
      if(targetHistory.id === id){
        return targetHistory;
      }
      //対象の履歴が存在しない
      else if(targetHistory.id > id){
        return null;
      }
    }
    return null;
  }

  #onChangeListener = [];
  addOnChangeListener(listener){
    this.#onChangeListener.push(listener);
  }
  #onChange(data){
    console.table(JSON.parse(JSON.stringify(this.#historyList)));
    this.#onChangeListener.forEach(listener=>listener(data));
  }

  #beforePopStateListener = [];
  addBeforePopStateListener(listener){
    this.#beforePopStateListener.push(listener);
  }
  async #onBeforePopState(){
    const promises = this.#beforePopStateListener.map(listener => Promise.resolve(listener()));
    const results = await Promise.allSettled(promises);
    const pop = results.some(({value})=>value);
    return pop;
  }
  
  constructor(){
    const genSessionId = ()=>Math.random();
    let sessionID;
    const onPopState = async e=>{
      if(this.#force){
        this.#force = false;
        return;
      }
      //一旦保管
      const thisSessionId = genSessionId();
      sessionID = thisSessionId;

      //戻る操作を打ち消し
      const currentHistory = this.#historyList[this.#historyList.length-1];
      history.pushState(currentHistory.id, null);
  
      //戻る操作を実行するか確認する
      const pop = await this.#onBeforePopState();
      //間に他セッションが実行されている場合は何もしない
      if(sessionID !== thisSessionId){
        return;
      }
      //戻る操作をする場合
      if(pop){
        //戻る操作を実行
        this.#forceBack();
        const historyId = e.state;
        const historyData = this.#findHistoryById(historyId);
        if(historyData){
          this.#onChange(historyData.data);
        }
      }
    }
    window.addEventListener("popstate", onPopState);
  }
}

export default LocalHistory;