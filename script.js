/* ===================================================================
   手動音量調整 & 連打防止機能
   =================================================================== */

// 現在再生中のオーディオを記憶する変数
let currentAudio = null;

const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // 1. 音声要素の取得
    const audioId = button.getAttribute('data-audio');
    const audio = document.getElementById(audioId);

    // エラー回避
    if (!audio || !audio.getAttribute('src')) {
      console.log("音声ファイルなし: " + audioId);
      return;
    }

    // 2. 前の音声を停止（連打防止）
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // 3. 音量の決定（ここが重要！）
    // HTMLに data-vol が書いてあればその音量、書いてなければ 0.5 (50%)
    const volSetting = button.getAttribute('data-vol');
    
    if (volSetting) {
      audio.volume = parseFloat(volSetting); // 指定値 (0.0〜1.0)
    } else {
      audio.volume = 0.5; // デフォルト値
    }

    // 4. 再生
    audio.currentTime = 0;
    audio.play().catch(e => console.error("再生エラー", e));
    
    // 現在の音声を記憶
    currentAudio = audio;
  });
});


/* ===================================================================
   検索ボックス機能 (変更なし)
   =================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    const contentBoxes = document.querySelectorAll('.content-box');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const keyword = input.value.trim();
        if (!keyword) return;

        const regex = new RegExp(`(${keyword})`, 'gi');
        let firstMatch = null;

        contentBoxes.forEach(box => {
            const buttons = box.querySelectorAll('.btn');
            buttons.forEach(btn => {
                btn.innerHTML = btn.textContent;
                if (regex.test(btn.textContent)) {
                    btn.innerHTML = btn.textContent.replace(regex, '<span class="highlight">$1</span>');
                    if (!firstMatch) firstMatch = btn;
                }
            });
        });

        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});