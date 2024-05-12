// ページが全て読み込まれた後に実行する処理を設定
window.addEventListener("load", function () {
  // メニューボタンの要素を取得
  var $button = document.querySelector(".toggle-menu-button");
  // メニューの要素を取得
  var $menu = document.querySelector(".header-site-menu");

  // メニューボタンがクリックされたときの処理を設定
  $button.addEventListener("click", function () {
    // メニューが表示されている場合
    if ($menu.classList.contains("is-show")) {
      // メニューを非表示にする
      $menu.classList.remove("is-show");
    } else {
      // メニューが非表示の場合、メニューを表示する
      $menu.classList.add("is-show");
    }
  });
});
