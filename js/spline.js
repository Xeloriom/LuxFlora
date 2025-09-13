// spline.js
import { Application } from "https://unpkg.com/@splinetool/runtime@1.10.56/build/runtime.js";

const container = document.getElementById("canvas3d");
const canvas = document.createElement("canvas");
container.appendChild(canvas);

const loader = document.getElementById("preloader");
const spline = new Application(canvas);

let firstObj;
let splineZoom = null;

// 📱 Fonction pour détecter mobile
function isMobileView() {
  return window.innerWidth <= 768;
}

// 💡 Définir les zoomLevels en fonction du viewport
function getZoomLevels() {
  return isMobileView()
    ? [0.5, 0.4, 0.3, 0.4, 0.4, 0.3] // Zoom plus éloigné sur mobile
    : [1.2, 1.0, 0.8, 0.6, 1.0, 1.0]; // Zoom original sur PC
}

let zoomLevels = getZoomLevels();

// Zoom animé
export function setZoom(index) {
  if (!splineZoom) return;
  const startZoom = splineZoom.current;
  const endZoom = zoomLevels[index];
  const duration = 1000;
  const startTime = performance.now();

  function animate(time) {
    const t = Math.min((time - startTime) / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const zoomValue = startZoom + (endZoom - startZoom) * ease;
    spline.setZoom(zoomValue);
    splineZoom.current = zoomValue;
    if (t < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// Charger la scène
spline
  .load("https://prod.spline.design/MueqTX6Q6NEzhj16/scene.splinecode")
  .then(() => {
    if (loader) loader.style.display = "none";

    const allObjects = spline.getAllObjects();
    firstObj = allObjects[0];

    // ⚡ Ajuster la position selon mobile ou PC
    if (isMobileView()) {
      firstObj.position.x += 100;
      firstObj.position.y -= 50;
    } else {
      firstObj.position.x -= 100;
      firstObj.position.y -= 100;
    }

    firstObj.visible = true;

    // ✅ Zoom initial
    spline.setZoom(zoomLevels[0]);
    splineZoom = { current: zoomLevels[0] };
  })
  .catch((err) =>
    console.error("Erreur lors du chargement de la scène Spline :", err)
  );

// ✅ Redimensionnement responsive
function resizeCanvas() {
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  spline.resize();

  // ⚡ Réadapter les zoomLevels si on change mobile ↔ PC
  zoomLevels = getZoomLevels();
  if (splineZoom) {
    spline.setZoom(zoomLevels[0]);
    splineZoom.current = zoomLevels[0];
  }
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // appel initial
