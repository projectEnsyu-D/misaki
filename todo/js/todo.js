// 各入力フォーム、ボタン等の要素を取得
const content = document.getElementById("content");
const date = document.getElementById("date");
const time = document.getElementById("time");
const button = document.getElementById("button");
const taskSpace = document.getElementById("task-space");

// task格納用
let tasks = [];

// 現在の時間の取得
const currentTime = new Date().getTime();

// 週間後の時間の計算
const oneWeekLater = currentTime + 604800000; // 1週間後の時間

// 日時をフォーマットする関数
function formatDate(date) {
  const year = date.getFullYear(); // 年を取得
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // 月は0から始まるため、1を足す
  const day = ("0" + date.getDate()).slice(-2); // 日付を取得
  const hours = ("0" + date.getHours()).slice(-2); // 時間を取得
  const minutes = ("0" + date.getMinutes()).slice(-2); // 分を取得

  // フォーマットした日時を返す
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

// タスクを表示する関数
const displayTasks = () => {
  // ここでhtmlTagsを初期化
  let htmlTags = "";
  // task-outputの要素を取得
  const taskOutput = document.getElementById("task-output");

  // 現在の時間の取得
  const currentTime = new Date().getTime();

  // tasksをtimelimitでソート
  tasks.sort((a, b) => a.timelimit - b.timelimit);

  // tasksの中身を表示
  tasks.forEach((task, index) => {
    htmlTags += `
    <div class="task-item">
      <p>${task.content}, ${formatDate(new Date(task.timelimit))}
      <button onclick="deleteTask(${index})">削除</button></p>
    </div>
  `;
  });

  // tasksが空でない場合のみborderedクラスを追加
  if (tasks.length > 0) {
    taskOutput.classList.add("bordered");
    taskOutput.style.display = "block"; // タスクが存在する場合は表示
  } else {
    taskOutput.classList.remove("bordered");
    taskOutput.style.display = "none"; // タスクが存在しない場合は非表示
  }

  // htmlTagsをtaskOutputに表示
  taskOutput.innerHTML = htmlTags;
};

// タスクを削除する関数
const deleteTask = (index) => {
  // タスクを削除
  tasks.splice(index, 1);
  // 更新したタスクを保存
  localStorage.setItem("local-tasks", JSON.stringify(tasks));
  displayTasks();
};

// ページ読み込み時にローカルストレージからタスクを取得し、期限が過ぎたタスクを削除
window.onload = () => {
  // ローカルストレージからタスクを取得
  const storedTasks = localStorage.getItem("local-tasks");
  // タスクが存在する場合、tasksに格納
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    deleteExpiredTasks();
  }
};

// 期限が過ぎたタスクを削除する関数
const deleteExpiredTasks = () => {
  // 現在の時間を取得
  const now = Date.now();
  tasks = tasks.filter(task => {
    // タスクの期限から1週間後であれば削除
    return now < task.timelimit + 7 * 24 * 60 * 60 * 1000;
  });
  // 更新したタスクを保存
  localStorage.setItem("local-tasks", JSON.stringify(tasks));
};

// 1時間ごとに期限が過ぎたタスクを削除
setInterval(deleteExpiredTasks, 60 * 60 * 1000);

// localStorageに存在するかどうかの確認
// 存在すればそのままtasksに格納
const localTasks = localStorage.getItem("local-tasks");

if (!localTasks) {
  // ローカルストレージにtaskが無い時
  console.log("none");
} else {
  // ローカルストレージにタスクがある時
  // ローカルストレージから取り出すときはJSON.parse()
  tasks = JSON.parse(localTasks);
  displayTasks();
}

// unix時間を導き出すための関数
// 入力された日付・時間を結合して数値の配列に変え、返り値にする
const createDatetimeArray = (date, time) => {
  const datetimearr = [];
  // dateをハイフン(-)で年・月・時に分割
  const datearr = date.split("-");
  // timeをコロン(:)で時・分に分割
  const timearr = time.split(":");
  // 二つの配列を結合したのち数値に変換→空の配列に格納
  const tmparr = datearr.concat(timearr);
  tmparr.map((t) => {
    datetimearr.push(Number(t));
  });
  // 返した配列でunix時間へ変換
  return datetimearr;
};

// task追加の関数
const addTask = () => {
  // 入力フォームの存在性チェック
  if (!content.value || !date.value || !time.value) {
    alert("全項目を入力してください");
  } else {
    // 入力された日時を配列に格納
    const timearr = createDatetimeArray(date.value, time.value);
    // taskに格納する際、unix時間にする
    // new Dateに日時を指定する際、月だけ1少ない数じゃないと翌月になる
    const limitdate = new Date(
      timearr[0],
      timearr[1] - 1,
      timearr[2],
      timearr[3],
      timearr[4]
    );
    // ローカルへ保存前にtasksに格納する
    tasks.push({ content: content.value, timelimit: limitdate.getTime() });
    // ローカルストレージに格納するときはJSON.stringify()
    localStorage.setItem("local-tasks", JSON.stringify(tasks));
    displayTasks();

    // 入力欄をクリア
    content.value = "";
    date.value = "";
    time.value = "";
  }
};

// フォームに入力してボタンを押したらtasksに追加
button.addEventListener("click", addTask);
