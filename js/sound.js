document.addEventListener("DOMContentLoaded", () => {
  // --- Musique de fond ---
  const bgAudio = new Audio("sounds/soft-piano-inspiration-399920.mp3");
  bgAudio.loop = true;
  bgAudio.volume = 0.1;

  // --- Toggle musique bouton flottant ---
  const musicBtn = document.getElementById("musicToggleBtn");
  const bars = musicBtn.querySelectorAll(".music-bar");
  let isPlaying = false;

  // --- Click global avec audio instantané ---
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button, [role='button'], li");
    if (btn && !btn.dataset.noSound) {
      // Nouvelle instance Audio à chaque clic pour fiabilité
      const clickAudio = new Audio("sounds/ui-mouse-click-366460.mp3");
      clickAudio.volume = 0.4;
      clickAudio.playbackRate = 1.5;
      clickAudio.play().catch(() => {});
    }
  }, true);

  // --- Bouton musique ---
  musicBtn.addEventListener("click", () => {
    if (isPlaying) {
      bgAudio.pause();
      bars.forEach(bar => bar.classList.remove("music-bar-animate"));
    } else {
      bgAudio.play().catch(() => {});
      bars.forEach(bar => bar.classList.add("music-bar-animate"));
    }
    isPlaying = !isPlaying;
  });

});
