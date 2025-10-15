// 音声ボタン
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const audioId = button.getAttribute('data-audio');
    const audio = document.getElementById(audioId);
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  });
});

// 検索ボックス
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    const contentBoxes = document.querySelectorAll('.content-box');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const keyword = input.value.trim();
        if (!keyword) return;

        const regex = new RegExp(`(${keyword})`, 'gi');

        let firstMatch = null; // 最初にヒットした要素を覚える

        contentBoxes.forEach(box => {
            const buttons = box.querySelectorAll('.btn');
            buttons.forEach(btn => {
                // ハイライトをリセット
                btn.innerHTML = btn.textContent;
                // キーワードをハイライト
                if (regex.test(btn.textContent)) {
                    btn.innerHTML = btn.textContent.replace(regex, '<span class="highlight">$1</span>');
                    // 最初にヒットしたボタンを保存
                    if (!firstMatch) firstMatch = btn;
                }
            });
        });

        // 最初にヒットしたボタンまでスクロール
        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});
