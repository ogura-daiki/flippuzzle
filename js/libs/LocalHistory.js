
class LocalHistory {

  #historyList = [];
  #historyId = 0;
  #currentIndex = -1;
  #getCurrentHistory(){
    if(this.#currentIndex < 0) this.#currentIndex = 0;
    return this.#historyList[this.#currentIndex]||this.#historyList[0];
  }
  #cut(){
    if(this.#historyList.length > this.#currentIndex){
      this.#historyList.splice(this.#currentIndex+1, this.#historyList.length-1-this.#currentIndex);
    }
  }
  push(data){
    if(history.state == null && this.#historyList.length){
      history.pushState(this.#historyList[0]?.id, null);
    }
    const historyData = {id:this.#historyId, data};
    this.#cut();
    this.#historyList.push(historyData);
    this.#currentIndex += 1;
    history.pushState(this.#historyId, null);
    this.#historyId += 1;
    this.#onChange(data);
  }
  forward(force){
    if(force){
      this.#forceForward();
      this.#currentIndex+=1;
      this.#onChange(this.#getCurrentHistory().data);
      return;
    }
    history.forward();
  }
  back(force){
    if(force){
      this.#forceBack();
      this.#currentIndex -= 1;
      const currentHistory = this.#getCurrentHistory();
      if(!currentHistory){
        return;
      }
      this.#onChange(currentHistory.data);
      return;
    }
    history.back();
  }
  #force = false;
  #forceBack(){
    this.#force = true;
    history.back();
  }
  #forceForward(){
    this.#force = true;
    history.forward();
  }
  replace(replacer){
    this.#cut();
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
    //console.log(this.#currentIndex);
    //console.table(JSON.parse(JSON.stringify(this.#historyList)));
    this.#onChangeListener.forEach(listener=>listener(data));
  }

  #beforePopStateListener = [];
  addBeforePopStateListener(listener){
    this.#beforePopStateListener.push(listener);
  }
  async #onBeforePopState(isForward){
    const promises = this.#beforePopStateListener.map(listener => Promise.resolve(listener(isForward)));
    const results = await Promise.allSettled(promises);
    const pop = results.some(({value})=>value);
    return pop;
  }

  #isForwardHistory(id){
    const targetIndex = this.#historyList.findIndex(history=>history.id === id);
    if(this.#currentIndex === targetIndex) return null;
    return targetIndex > this.#currentIndex;
  }
  
  constructor(){
    const genSessionId = ()=>Math.random();
    let sessionID;
    const onPopState = async e=>{
      if(this.#force){
        this.#force = false;
        return;
      }
      const historyId = e.state;

      //一旦保管
      const thisSessionId = genSessionId();
      sessionID = thisSessionId;

      //戻る・進む操作を打ち消し
      const isForward = this.#isForwardHistory(historyId);
      if(isForward === null){
        //進む操作を打ち消し
        this.#forceBack();
        return;
      }
      const waitPopState = new Promise(resolve=>{
        const temp = ()=>resolve();
        window.addEventListener("popstate", ()=>{
          resolve();
          window.removeEventListener("popstate", temp);
        });
      });
      if(isForward){
        //進む操作を打ち消し
        this.#forceBack();
      }
      else{
        //戻る操作を打消し
        this.#forceForward();
      }

      await waitPopState;
      //戻る操作を実行するか確認する
      const pop = await this.#onBeforePopState(isForward);
      //間に他セッションが実行されている場合は何もしない
      if(sessionID !== thisSessionId){
        return;
      }
      //戻る操作をする場合
      if(pop){
        if(isForward){
          //進む操作を実行
          this.forward(true);
        }
        else{
          //戻る操作を実行
          this.back(true);
        }
      }
    }
    window.addEventListener("popstate", onPopState);
  }
}

export default LocalHistory;