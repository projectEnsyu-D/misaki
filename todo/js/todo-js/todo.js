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

// 日付をフォーマットする関数
function formatDate(date) {
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${month}/${day}`;
}

// 時間をフォーマットする関数
function formatTime(date) {
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  return `${hours}:${minutes}`;
}

// タスクを表示する関数
const displayTasks = () => {
  let htmlTags = "";
  const taskOutput = document.getElementById("task-output");
  const currentTime = new Date().getTime();
  tasks.sort((a, b) => a.timelimit - b.timelimit);
  tasks.forEach((task, index) => {
    // 期限が過ぎているかどうかを確認
    const isExpired = task.timelimit < currentTime;
    // 期限が過ぎている場合は、"expired"クラスを適用
    const taskClass = isExpired ? "task-item expired" : "task-item";
    htmlTags += `
  <div class="${taskClass}">
  <p><strong class="display_data">${formatDate(
    new Date(task.timelimit)
  )}</strong>${formatTime(new Date(task.timelimit))} ,${task.content}
    <button class="delete-button" onclick="deleteTask(${index})">完了</button></p>
  </div>`;
  });
  // tasksが空でない場合のみborderedクラスを追加
  if (tasks.length > 0) {
    taskOutput.classList.add("bordered");
    taskOutput.style.display = "block";
  } else {
    taskOutput.classList.remove("bordered");
    taskOutput.style.display = "none";
  }
  taskOutput.innerHTML = htmlTags;
};
// ページ読み込み時にローカルストレージからタスクを取得し、期限が過ぎたタスクを削除
document.addEventListener("DOMContentLoaded", () => {
  const filterSelect = document.getElementById("filter");
  filterSelect.addEventListener("change", filterTasks);
});

// カテゴリーでタスクをフィルタリングする関数
function filterTasks() {
  const selectedCategory = document.getElementById("filter").value;
  const currentTime = new Date().getTime();
  const originalTasks = tasks.slice(); // 元のtasks配列を保存
  const filteredTasks = tasks.filter(
    (task) => task.category === selectedCategory || selectedCategory === "all"
  );

  // filteredTasksをtasksに一時的に設定
  tasks = filteredTasks;
  displayTasks(); // displayTasksを呼び出してフィルタリングされたタスクを表示
  tasks = originalTasks; // 元のtasks配列に戻す
}

// タスクを削除する関数
const deleteTask = (index) => {
  tasks.splice(index, 1);
  localStorage.setItem("local-tasks", JSON.stringify(tasks));
  displayTasks();
};

// ページ読み込み時にローカルストレージからタスクを取得し、期限が過ぎたタスクを削除
window.onload = () => {
  const storedTasks = localStorage.getItem("local-tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    deleteExpiredTasks();
  }
};

// 期限が過ぎたタスクを削除する関数
const deleteExpiredTasks = () => {
  const now = Date.now();
  tasks = tasks.filter((task) => {
    return now < task.timelimit + 7 * 24 * 60 * 60 * 1000;
  });
  localStorage.setItem("local-tasks", JSON.stringify(tasks));
};

// localStorageに存在するかどうかの確認
// 存在すればそのままtasksに格納
const localTasks = localStorage.getItem("local-tasks");
if (!localTasks) {
  // ローカルストレージにtaskが無い時
  console.log("none");
} else {
  // ローカルストレージにタスクがある時
  tasks = JSON.parse(localTasks);
  displayTasks();
}

// unix時間を導き出すための関数
// 入力された日付・時間を結合して数値の配列に変え、返り値にする
const createDatetimeArray = (date, time) => {
  const datetimearr = [];
  const datearr = date.split("-");
  const timearr = time.split(":");
  const tmparr = datearr.concat(timearr);
  tmparr.map((t) => {
    datetimearr.push(Number(t));
  });
  return datetimearr;
};

// タスクを追加する関数
const addTask = () => {
  if (
    !content.value ||
    !date.value ||
    !time.value ||
    category.selectedIndex <= 0
  ) {
    alert("全項目を入力してください");
  } else {
    const timearr = createDatetimeArray(date.value, time.value);
    const limitdate = new Date(
      timearr[0],
      timearr[1] - 1,
      timearr[2],
      timearr[3],
      timearr[4]
    );
    const category = document.getElementById("category").value;
    const now = new Date();
    const oneWeekAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );
    if (limitdate < oneWeekAgo) {
      alert("期限が1週間以上前です。");
    } else {
      tasks.push({
        content: content.value,
        timelimit: limitdate.getTime(),
        category: category,
      });
      localStorage.setItem("local-tasks", JSON.stringify(tasks));
      displayTasks();
      // 入力欄をクリア
      content.value = "";
      date.value = "";
      time.value = "";
      document.getElementById("category").selectedIndex = 0;
    }
  }
};

// フォームに入力してボタンを押したらtasksに追加
button.addEventListener("click", addTask);
