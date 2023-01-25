'use strict';

{
  const inputText = document.getElementById("input");
  const addBtn = document.getElementById("addBtn");
  const taskList = document.getElementById("taskList");
  const message = document.getElementById("message");
  const next = document.getElementById("next");
  let count = 0;//localstorageの番数

  const p = document.getElementById("id");

  $(function (){//表示
    $("h1").animate({"opacity" : "1", "font-size" : "68px"}, 1500, "swing");
  });

  if(localStorage.length !== 0) {//前のタスクが終わっていなかったら
    $("#input").remove();
    $("#addBtn").remove();
    if(document.getElementById("next") != null) $("#next").remove();
    for(let i=0; i<localStorage.length; i++) {
      const task = document.createElement("li");
      task.classList.add("nextTask");
      task.style.marginTop = "10px";
      task.style.paddingTop = "10px";
      task.textContent = localStorage.getItem(i);
      taskList.appendChild(task);
    }
    doPhase();
    message.textContent = "まだタスクが残っています";
  } else {//前のタスクが残っていなかったら
    inputPhase();
  }


  function inputPhase() {
    appear();
    message.textContent = "今日やることを6つ決めてください";
    addBtn.addEventListener('click', addPress);
    $(document).keypress(function(e){// エンターキーだったら無効にする
      if (e.key === 'Enter') {
        return false;
      }
    });
    next.addEventListener('click', sortPhase);
  }


  function addPress() {
    if(inputText.value != '') createTask();

    message.textContent = "あと" + (6-count) +"つ決めてください";
    if(count === 6){
      $("#addBtn").css({'pointer-events' : 'none'});
      $("#next").css({'pointer-events' : 'auto', 'cursor' : 'pointer', 'opacity' : '1'});
      message.textContent = "";
      inputText.disabled = true;
      inputText.placeholder = "";
    };
  }


  function createTask() {//タスクの作成
    const task = document.createElement("li");
    task.classList.add("task");
    taskList.appendChild(task);

    const taskValue = document.createElement("p");
    taskValue.textContent = inputText.value;
    task.appendChild(taskValue);

    const delBtn = document.createElement("div");
    delBtn.classList.add("delBtn");
    delBtn.textContent = "削除";
    task.appendChild(delBtn);
    
    inputText.value = '';
    inputText.focus();
    delBtn.addEventListener('click', () => {//削除処理
      task.remove();
      count--;
      message.textContent = "あと" + (6-count) +"つ決めてください";
      if(count === 5) {
          $("#addBtn").css({'cursol' : 'pointer', 'pointer-events' : 'auto'});
          inputText.disabled = false;
        }
    });
    count++;
    console.log("要素の個数" + count);
  }

  function rebuildAll() {
    document.querySelectorAll("li > div").forEach (element => {
      element.remove();
    })

    let i = 0;
    document.querySelectorAll("li").forEach (element => {
      element.classList.add("nextTask");
      element.style.marginTop = "10px";
      element.style.paddingTop = "10px";
      element.id = ("task" + i);
      element.setAttribute('draggable',true);
      i++;
    });
  }


  function sortPhase() {
    $(function (){
      $("#sheet").animate({"opacity" : "0"}, 800, function(){
        var str = "優先順位をつけてください\n(ドラッグアンドドロップ)";
        message.innerHTML = str.replace(/\n/g, "<br>");
        inputText.remove();
        addBtn.remove();
        rebuildAll();

        $("li").css({'cursor' : 'pointer','transition' : '0.8s'});
        $("task:hover").css({'background' : 'rgb(206, 206, 206)'});

        document.querySelectorAll("li").forEach (element => {//ドラッグアンドドロップ
          
          element.ondragstart = function (event) {// ドラッグが始まったとき
            event.dataTransfer.setData('text/plain', event.target.id);
          };
          
          element.ondragover = function (event) {//重なったとき
            event.preventDefault();
            this.style.background = 'rgb(206, 206, 206)';
          };
          
          element.ondragleave = function (event) {// 要素が外れたとき
            this.style.background = ''
          };
          
          element.ondrop = function () {//要素が外れた場所
            let id = event.dataTransfer.getData('text/plain');
            let element_drag = document.getElementById(id);
            this.parentNode.insertBefore(element_drag, this.nextSibling);//要素の後に挿入
            this.style.background = ''
            event.preventDefault();
          };
        });
      });
      appear();
    });
    next.remove();
    const secondNext = document.createElement('div');
    secondNext.id = "secondNext";
    secondNext.textContent = "次へ";
    document.querySelector("body").appendChild(secondNext);
    secondNext.addEventListener('click', doPhase)
  }


  function doPhase() {
    addLocalstorage();
    $("#sheet").animate({"opacity" : "0"}, 1000, function() {
      if(document.getElementById("secondNext") != null) secondNext.remove();
      let i = 0;
      document.querySelectorAll("li > p").forEach (element => {
        element.textContent = localStorage.getItem(i);
        i++;
      });

      document.querySelectorAll("li").forEach (element => {
        element.setAttribute('draggable',false);
        element.addEventListener('click', () => {
          element.classList.add("checked");
        });
      });

      thirdNext.id = "thirdNext";
      thirdNext.textContent = "全て完了";
      document.querySelector("body").appendChild(thirdNext);
      message.textContent = "終わったタスクはクリックしてください";
      
    });
    
    const thirdNext = document.createElement('div');
    appear();
    thirdNext.addEventListener('click', () => {
      $("#sheet").animate({"opacity" : "0"}, 1000, function () {
        taskList.remove();
        localStorage.clear();
        message.textContent = "お疲れ様でした";
        message.style.fontSize = "32px";
        message.style.color = "white";
        thirdNext.remove();
        
        $("#inputParts").remove();
        $("#sheet").css({'background' : 'rgb(62, 242, 255)'})
      });
      appear();
    })
  }


  function addLocalstorage() {
    let i = 0;
    document.querySelectorAll("li > p").forEach (element => {
      localStorage.setItem(i, element.textContent);
      i++;
    });
  }


  function appear() {
    $(function (){
      $("#sheet").animate({"opacity" : "1"}, 1000);
    });
  }


  function disappear() {
    $("#sheet").animate({"opacity" : "0"}, 1000);
  }
}