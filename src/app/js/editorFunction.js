import domObjects from "../../entities/documentObject.js";
import mapFilter from "../../entities/mapFilter.js";
import { applyFilter } from "../../Features/applyFIlter.js";
import {
  sliderRangeMinus100toPlus100,
  sliderRangeZerotoPlus100,
} from "../../Features/sliderSetting.js";
import { resetMapFilter } from "../../Features/resetFilter.js";
let changer;
let backupImage = [];
let activeObjectMap = new Map();
const fabricCanvas = new fabric.Canvas(domObjects.canvas);
(function () {
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
})();
domObjects.imageLoad.addEventListener("change", (e) => {
  let file = domObjects.imageLoad.files[0];
  let loadImage = new Image();
  loadImage.src = URL.createObjectURL(file);
  loadImage.addEventListener("load", () => {
    initializeImage(loadImage);
  });
  if (e.target.value) e.target.value = "";
});
function initializeImage(loadImage) {
  let scale = imgScale(loadImage.width, loadImage.height);
  fabric.Image.fromURL(loadImage.src, function (img) {
    activeObjectMap.set(img, backupImage.length);
    backupImage.push(loadImage);
    img.scale(scale);
    fabricCanvas.centerObject(img);
    fabricCanvas.add(img);
    fabricCanvas.setActiveObject(img);
  });
  setTimeout(function () {
    pushFilter(fabricCanvas.getActiveObject());
  }, 500);
}
function pushFilter(obj) {
  for (const [key, value] of mapFilter) {
    if (key === "opacity") continue;
    else if (key === "pixelate") {
      mapFilter.get("pixelate").filter.blocksize = 1;
      obj.filters.push(mapFilter.get("pixelate").filter);
    } else obj.filters.push(value.filter);
  }
}
function imgScale(width, height) {
  let canvasWidth = fabricCanvas.getWidth();
  let canvasHeight = fabricCanvas.getHeight();
  return Math.min(canvasWidth / width, canvasHeight / height);
}
domObjects.slider.addEventListener("input", (event) => {
  domObjects.rangeValueDisplay.value = event.target.value;
  handlerSilderAndRange(event.target.value);
});
domObjects.rangeValueDisplay.addEventListener("change", (event) => {
  let rangeValue = Number(event.target.value);
  if (isNaN(rangeValue)) return;
  domObjects.slider.value = event.target.value;
  handlerSilderAndRange(event.target.value);
});
function handlerSilderAndRange(value) {
  if (typeof changer !== "undefined") {
    let changeValue = mapFilter.get(changer);
    changeValue.value = value;
    mapFilter.set(changer, changeValue);
    applyFilter(changer, fabricCanvas);
  }
}
domObjects.brightness.addEventListener("click", () => {
  let filterName = domObjects.brightness.name;
  sliderRangeMinus100toPlus100(filterName);
  changer = filterChanger(filterName);
});
domObjects.blurFilter.addEventListener("click", () => {
  sliderRangeZerotoPlus100("blur");
  changer = filterChanger("blur");
});
domObjects.contrast.addEventListener("click", () => {
  let filterName = domObjects.contrast.name;
  sliderRangeMinus100toPlus100(filterName);
  changer = filterChanger(filterName);
});
domObjects.pixelate.addEventListener("click", () => {
  let filterName = domObjects.pixelate.name;
  domObjects.slider.min = 1;
  domObjects.slider.max = 25;
  domObjects.slider.value = mapFilter.get(filterName).value;
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
  changer = filterChanger(filterName);
});
domObjects.vibrance.addEventListener("click", () => {
  let filterName = domObjects.vibrance.name;
  sliderRangeMinus100toPlus100(filterName);
  changer = filterChanger(filterName);
});
domObjects.opacity.addEventListener("click", () => {
  let filterName = domObjects.opacity.name;
  sliderRangeZerotoPlus100(filterName);
  changer = filterChanger(filterName);
});
domObjects.saturate.addEventListener("click", () => {
  let filterName = domObjects.saturate.name;
  sliderRangeMinus100toPlus100(filterName);
  changer = filterChanger(filterName);
});
domObjects.noise.addEventListener("click", () => {
  let filterName = domObjects.noise.name;
  sliderRangeZerotoPlus100(filterName);
  changer = filterChanger(filterName);
});
const filterChanger = (str) => str;
domObjects.resetBtnFilter.addEventListener("click", () => {
  let obj = fabricCanvas.getActiveObject();
  resetMapFilter(obj);
  fabricCanvas.renderAll();
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
let convertorFlag = true;
function convertFabricToCropper() {
  let obj = fabricCanvas.getActiveObject();
  domObjects.img.src = obj.toDataURL({
    withoutTransform: true,
  });
  console.log(domObjects.img.naturalWidth, domObjects.img.naturalHeight);
  fabricCanvas.remove(obj);
  fabricCanvas.renderAll();
  convertorFlag = checkStage(false);
  domObjects.cropperDiv.style.zIndex = 1;
  return obj;
}
function universalConditionalForFabricTransform() {
  if (!convertorFlag) convertCropperToFabric();
}
function convertCropperToFabric() {
  domObjects.cropperDiv.style.zIndex = -1;
  initializeImage(domObjects.img);
  domObjects.img.src = "";
  convertorFlag = checkStage(true);
}
let backupCropImage;
domObjects.transform.addEventListener("click", () => {
  if (convertorFlag) convertFabricToCropper();
  backupCropImage = domObjects.img.src;
  let cropper = new Cropper(domObjects.img, {
    aspectRatio: 0,
    viewMode: 2,
    autoCropArea: 1,
    ready: () => {
      domObjects.makeCrop.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.move(100);
          domObjects.img.src = cropper
            .getCroppedCanvas({
              imageSmoothingEnabled: true,
              imageSmoothingQuality: "high",
            })
            .toDataURL();
          cropper.destroy();
          cropper = null;
        }
      });
      domObjects.rotatePlus45.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.rotate(45);
          domObjects.img.src = cropper.getCroppedCanvas().toDataURL();
          cropper.destroy();
          cropper = null;
        }
      });
      domObjects.rotateMinus45.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.rotate(-45);
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
  domObjects.img.src = backupCropImage;
  domObjects.transform.dispatchEvent(new Event("click"));
});
fabricCanvas.on("mouse:wheel", function (opt) {
  var delta = opt.e.deltaY;
  var zoom = fabricCanvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.3) zoom = 0.3;
  fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});
let checkStage = (boolValue) => boolValue;
domObjects.fineTuning.addEventListener("click", () => {
  universalConditionalForFabricTransform();
});
