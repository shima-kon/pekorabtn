/* ===================================================================
   方法A: Web Audio API (自動音量均一化)
   ※ 注意: ローカル(file://)では動きません。GitHub Pages等で動作します。
   =================================================================== */

// Web Audio API用の変数
let audioCtx;
let compressor;
let masterGain;
const connectedAudios = new Set(); // 一度接続したAudio要素を記録
let currentAudio = null; // 現在再生中のAudio

const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // 1. AudioContextの準備 (ユーザー操作で開始)
    initAudioContext();

    const audioId = button.getAttribute('data-audio');
    const audio = document.getElementById(audioId);

    if (!audio || !audio.getAttribute('src')) return;

    // 2. Web Audio APIへの接続 (初回のみ)
    // これをしないとコンプレッサーが通りません
    if (!connectedAudios.has(audioId)) {
      // CORSエラー対策（外部サーバの場合に必要）
      audio.crossOrigin = "anonymous";
      
      const source = audioCtx.createMediaElementSource(audio);
      source.connect(compressor); // コンプレッサーへ繋ぐ
      connectedAudios.add(audioId);
    }

    // 3. 前の音を止める
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // 4. 再生
    audio.currentTime = 0;
    
    // AudioContextが止まっていたら再開
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    audio.play().catch(e => console.error("再生エラー:", e));
    currentAudio = audio;
  });
});

// --- 音響機器の配線（コンプレッサー設定） ---
function initAudioContext() {
  if (audioCtx) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  // コンプレッサー（音の粒を揃える装置）
  compressor = audioCtx.createDynamicsCompressor();
  // しきい値: これより大きい音を圧縮 (-50〜0) ※ここを調整！
  compressor.threshold.value = -30; 
  compressor.knee.value = 40;
  compressor.ratio.value = 12; // 圧縮の強さ
  compressor.attack.value = 0;
  compressor.release.value = 0.25;

  // 最終音量（コンプレッサーで少し音が痩せるので持ち上げる）
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 1.5; // 1.5倍の音量にする

  // 配線: 音源 -> コンプレッサー -> 音量増幅 -> スピーカー
  compressor.connect(masterGain);
  masterGain.connect(audioCtx.destination);
}


/* --- 検索機能（変更なし） --- */
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