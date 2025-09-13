document.addEventListener("DOMContentLoaded", () => {
  const circle = document.getElementById("progress-circle");

  let progress = 0;
  const totalLength = 2 * Math.PI * 45; // circonférence r=45
  const speed = 0.5; // vitesse du loader

  function animateLoader() {
    progress += speed;
    if (progress > 100) progress = 100;

    const offset = totalLength * (1 - progress / 100);
    circle.style.strokeDashoffset = offset;

    if (progress < 100) {
      requestAnimationFrame(animateLoader);
    }
  }
  animateLoader();
});
