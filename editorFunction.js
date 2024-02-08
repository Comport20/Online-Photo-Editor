const domObjects = {
  img: document.querySelector("#img-id"),
  imageLoad: document.querySelector("#load-input"),
  brightness: document.querySelector("[id='0']"),
  blurFilter: document.querySelector("[id='1']"),
  contrast: document.querySelector("[id='2']"),
  grayscale: document.querySelector("[id='3']"),
  invert: document.querySelector("[id='4']"),
  opacity: document.querySelector("[id='5']"),
  saturate: document.querySelector("[id='6']"),
  sepia: document.querySelector("[id='7']"),
  filterButton: document.querySelector(".filter-button"),
  rangeValueDisplay: document.querySelector(".range-value-display"),
  slider: document.querySelector(".slider"),
  resetBtn: document.querySelector(".reset-btn"),
  ratio: document.querySelector("#ratio"),
  cropMode: document.querySelector("#crop-mode"),
  makeCrop: document.querySelector("#make-crop"),
  crop: document.querySelector("#crop"),
  rotatePlus90: document.querySelector("#btn-rotate-plus90"),
  rotateMinus90: document.querySelector("#btn-rotate-minus90"),
  mirror: document.querySelector("#mirror"),
  flip: document.querySelector("#flip"),
  cropReset: document.querySelector("#crop-reset-btn"),
  canvas: document.querySelector(".canvas-style"),
};
let changer;
let backupImage;
const ctx = domObjects.canvas.getContext("2d");
(function () {
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
})();
const mapFilter = new Map([
  ["brightness", 100],
  ["blurFilter", 0],
  ["contrast", 100],
  ["grayscale", 0],
  ["invert", 0],
  ["opacity", 100],
  ["saturate", 100],
  ["sepia", 0],
]);
function applyFilter() {
  domObjects.img.style.filter = `brightness(${mapFilter.get(
    "brightness"
  )}%) blur(${mapFilter.get("blurFilter")}px)
     contrast(${mapFilter.get("contrast")}%) grayscale(${mapFilter.get(
    "grayscale"
  )}%) 
     invert(${mapFilter.get("invert")}%) opacity(${mapFilter.get("opacity")}%) 
     saturate(${mapFilter.get("saturate")}%) sepia(${mapFilter.get("sepia")}%)`;
}
domObjects.imageLoad.addEventListener("change", () => {
  let file = domObjects.imageLoad.files[0];
  domObjects.img.src = URL.createObjectURL(file);
  domObjects.img.addEventListener("load", () => {
    domObjects.img.className = "editable-image load";
    scale = imgScale();
    ctx.drawImage(domObjects.img, 0, 0, imgWidth * scale, imgHeight * scale);
    applyFilter();
  });
});
function imgScale() {
  let imgWidth = domObjects.img.width;
  let imgHeight = domObjects.img.height;
  let canvasWidth = domObjects.canvas.width;
  let canvasHeight = domObjects.canvas.height;
  return Math.min(canvasWidth / imgWidth, (canvasHeight + 50) / imgHeight);
}
domObjects.slider.addEventListener("change", (event) => {
  domObjects.rangeValueDisplay.value = event.target.value;
  if (typeof changer !== "undefined") {
    mapFilter.set(changer, event.target.value);
    applyFilter();
  }
});

domObjects.rangeValueDisplay.addEventListener("change", (event) => {
  let rangeValue = Number(event.target.value);
  if (isNaN(rangeValue)) return;
  domObjects.slider.value = event.target.value;
  if (typeof changer !== "undefined") {
    mapFilter.set(changer, event.target.value);
    applyFilter();
  }
});
domObjects.brightness.addEventListener("click", () => {
  let filterName = domObjects.brightness.name;
  domObjects.slider.min = 0;
  domObjects.slider.max = 200;
  domObjects.slider.value = mapFilter.get(filterName);
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
  changer = filterChanger(filterName);
});
domObjects.blurFilter.addEventListener("click", () => {
  domObjects.slider.min = 0;
  domObjects.slider.max = 10;
  domObjects.slider.value = mapFilter.get("blurFilter");
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
  changer = filterChanger("blurFilter");
});
domObjects.contrast.addEventListener("click", () => {
  let filterName = domObjects.contrast.name;
  domObjects.slider.min = 0;
  domObjects.slider.max = 200;
  domObjects.slider.value = mapFilter.get(filterName);
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
  changer = filterChanger(filterName);
});
domObjects.grayscale.addEventListener("click", () => {
  let filterName = domObjects.grayscale.name;
  domObjects.slider.min = 0;
  domObjects.slider.max = 100;
  domObjects.slider.value = mapFilter.get(filterName);
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
  changer = filterChanger(filterName);
});
domObjects.invert.addEventListener("click", () => {
  let filterName = domObjects.invert.name;
  domObjects.slider.min = 0;
  domObjects.slider.max = 100;
  domObjects.slider.value = mapFilter.get(filterName);
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
  changer = filterChanger(filterName);
});
domObjects.opacity.addEventListener("click", () => {
  let filterName = domObjects.opacity.name;
  domObjects.slider.min = 0;
  domObjects.slider.max = 100;
  domObjects.slider.value = mapFilter.get(filterName);
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
  changer = filterChanger(filterName);
});
domObjects.saturate.addEventListener("click", () => {
  let filterName = domObjects.saturate.name;
  domObjects.slider.min = 0;
  domObjects.slider.max = 200;
  domObjects.slider.value = mapFilter.get(filterName);
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
  changer = filterChanger(filterName);
});
domObjects.sepia.addEventListener("click", () => {
  let filterName = domObjects.sepia.name;
  domObjects.slider.min = 0;
  domObjects.slider.max = 100;
  domObjects.slider.value = mapFilter.get(filterName);
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
  changer = filterChanger(filterName);
});
const filterChanger = (str) => str;
domObjects.resetBtn.addEventListener("click", () => {
  mapFilter.set("brightness", 100);
  mapFilter.set("blurFilter", 0);
  mapFilter.set("grayscale", 0);
  mapFilter.set("invert", 0);
  mapFilter.set("opacity", 100);
  mapFilter.set("saturate", 100);
  mapFilter.set("sepia", 0);
  applyFilter();
});
domObjects.cropMode.addEventListener("click", () => {
  backupImage = new Image();
  backupImage.src = domObjects.img.src;
});
domObjects.ratio.addEventListener("click", () => {
  const cropper = new Cropper(domObjects.img, {
    aspectRatio: 5 / 4,
    ready: function () {
      let newCrop = cropper.getCroppedCanvas().toDataURL();
      domObjects.img.src = newCrop;
      cropper.destroy();
    },
  });
});
domObjects.crop.addEventListener("click", () => {
  let cropper = new Cropper(domObjects.img, {
    aspectRatio: 0,
    viewMode: 2,
    autoCropArea: 1,
    ready: () => {
      domObjects.makeCrop.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.move(100);
          domObjects.img.src = cropper.getCroppedCanvas().toDataURL();
          cropper.destroy();
          cropper = null;
        }
      });
      domObjects.rotatePlus90.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.rotate(90);
          domObjects.img.src = cropper.getCroppedCanvas().toDataURL();
          cropper.destroy();
          cropper = null;
        }
      });
      domObjects.rotateMinus90.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.rotate(-90);
          domObjects.img.src = cropper.getCroppedCanvas().toDataURL();
          cropper.destroy();
          cropper = null;
        }
      });
      domObjects.flip.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.scale(1, -1);
          domObjects.img.src = cropper.getCroppedCanvas().toDataURL();
          cropper.destroy();
          cropper = null;
        }
      });
      domObjects.mirror.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.scale(-1, 1);
          domObjects.img.src = cropper.getCroppedCanvas().toDataURL();
          cropper.destroy();
          cropper = null;
        }
      });
    },
  });
});
domObjects.cropReset.addEventListener("click", () => {
  domObjects.img.src = backupImage.src;
  crop.dispatchEvent(new Event("click"));
});
