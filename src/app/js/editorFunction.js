import domObjects from "../../entities/documentObject.js";
import mapFilter from "../../entities/mapFilter.js";
import { applyFilter } from "../../Features/applyFIlter.js";
import {
  sliderRangeMinus100toPlus100,
  sliderRangeZerotoPlus100,
} from "../../Features/sliderSetting.js";
import { resetMapFilter } from "../../Features/resetFilter.js";
import {
  toggleFlagVisibleSlider,
  toggleFlagHiddenSlider,
} from "../../Features/toggleFlag.js";
const divScroll = document.querySelector(".filter-button");
divScroll.addEventListener("wheel", (e) => {
  e.preventDefault();
  divScroll.scrollLeft += e.deltaY * 0.4;
});
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
function convertFabricToCropper() {
  let obj = fabricCanvas.getActiveObject();
  domObjects.img.src = obj.toDataURL({
    withoutTransform: true,
  });
  console.log(domObjects.img.naturalWidth, domObjects.img.naturalHeight);
  fabricCanvas.remove(obj);
  fabricCanvas.renderAll();
  converterFlag = false;
  domObjects.cropperDiv.style.zIndex = 1;
  return obj;
}
function universalConditionalForFabricTransform() {
  if (!converterFlag) convertCropperToFabric();
}
function convertCropperToFabric() {
  domObjects.cropperDiv.style.zIndex = -1;
  converterFlag = true;
  initializeImage(domObjects.img);
  domObjects.img.src = "";
  cropper = null;
}
let converterFlag = true;
let backupCropImage;
domObjects.transform.addEventListener("click", () => {
  toggleFlagVisibleSlider(sliderArea, cropperButtons, "cropper-button");
  scrollToNewItem(cropperButtons);
  if (converterFlag) {
    convertFabricToCropper();
    backupCropImage = domObjects.img.src;
  }
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
          domObjects.transform.dispatchEvent(new Event("click"));
        }
      });
      domObjects.rotatePlus45.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.rotate(45);
          domObjects.img.src = cropper.getCroppedCanvas().toDataURL();
          cropper.destroy();
          cropper = null;
          domObjects.transform.dispatchEvent(new Event("click"));
        }
      });
      domObjects.rotateMinus45.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.rotate(-45);
          domObjects.img.src = cropper.getCroppedCanvas().toDataURL();
          cropper.destroy();
          cropper = null;
          domObjects.transform.dispatchEvent(new Event("click"));
        }
      });
      domObjects.flip.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.scale(1, -1);
          domObjects.img.src = cropper.getCroppedCanvas().toDataURL();
          cropper.destroy();
          cropper = null;
          domObjects.transform.dispatchEvent(new Event("click"));
        }
      });
      domObjects.mirror.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.scale(-1, 1);
          domObjects.img.src = cropper.getCroppedCanvas().toDataURL();
          cropper.destroy();
          cropper = null;
          domObjects.transform.dispatchEvent(new Event("click"));
        }
      });
      domObjects.cropReset.addEventListener("click", () => {
        domObjects.img.src = backupCropImage;
        cropper.destroy();
        cropper = null;
        domObjects.transform.dispatchEvent(new Event("click"));
      });
    },
  });
});

fabricCanvas.on("mouse:wheel", function (opt) {
  let delta = opt.e.deltaY;
  let zoom = fabricCanvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.3) zoom = 0.3;
  fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
});
domObjects.fineTuning.addEventListener("click", () => {
  toggleFlagVisibleSlider(sliderArea, filterButtons, "filter-button");
  scrollToNewItem(filterButtons);
  universalConditionalForFabricTransform();
});
domObjects.filter.addEventListener("click", () => {
  toggleFlagHiddenSlider(sliderArea, presetFilterButtons, "preset-filter-div");
  scrollToNewItem(presetFilterButtons);
  universalConditionalForFabricTransform();
});
domObjects.text.addEventListener("click", () => {
  toggleFlagHiddenSlider(sliderArea, textButtons, "text-func-div");
  scrollToNewItem(textButtons);
  universalConditionalForFabricTransform();
});
domObjects.resize.addEventListener("click", () => {
  toggleFlagHiddenSlider(sliderArea, resizeButtons, "resize-button");
  scrollToNewItem(resizeButtons);
  universalConditionalForFabricTransform();
});
const filterButtons = document.querySelector(".filter-button");
const cropperButtons = document.querySelector(".cropper-button");
const resizeButtons = document.querySelector(".resize-button");
const presetFilterButtons = document.querySelector(".preset-filter-div");
const textButtons = document.querySelector(".text-func-div");
const sliderArea = document.querySelector(".slider-area");
function scrollToNewItem(divBlock) {
  divBlock.scrollIntoView({ behavior: "smooth" });
}
let counter = 10;
const presetFilters = document.querySelectorAll(".preset-filter-btn");
let arrayValue = new Map();
for (const elem of presetFilters) {
  elem.addEventListener("change", (e) => {
    let activObj = fabricCanvas.getActiveObject();
    if (e.target.checked) {
      let filterCreater = new Function(
        `return new fabric.Image.filters.${e.target.dataset.filterName}();`
      );
      let filtersSetting = filterCreater();
      if (arrayValue.has(e.target.dataset.filterName)) {
        activObj.filters[arrayValue.get(e.target.dataset.filterName)] =
          filtersSetting;
      } else {
        arrayValue.set(e.target.dataset.filterName, counter);
        activObj.filters[counter++] = filtersSetting;
      }
      activObj.applyFilters();
      fabricCanvas.renderAll();
    } else {
      activObj.filters.splice(arrayValue.get(e.target.dataset.filterName), 1);
      activObj.applyFilters();
      fabricCanvas.renderAll();
    }
  });
}
let fabricText;
const textButtonsFunc = document.querySelectorAll(".text-func-btn");
const textDropMenu = document.querySelector("#text-drop-menu-btn");
const emojiDropMenu = document.querySelector("#emoji-drop-menu-btn");
const figureDropMenu = document.querySelector("#figure-drop-menu-btn");
const addTextBtn = document.querySelector("#add-text-btn");
const textArea = document.querySelector(".text-filed-btn-div");
const arrowCursor = document.querySelectorAll(".arrow");
addTextBtn.addEventListener("click", () => {
  const textField = document.querySelector("#input-text-field-id");
  fabricText = new fabric.Text(textField.value, {});
  fabricCanvas.centerObject(fabricText);
  fabricCanvas.add(fabricText);
});
textDropMenu.addEventListener("click", () => {
  textArea.classList.toggle("show");
  arrowCursor[0].classList.toggle("up");
});
emojiDropMenu.addEventListener("click", () => {
  arrowCursor[1].classList.toggle("up");
});
figureDropMenu.addEventListener("click", () => {
  arrowCursor[2].classList.toggle("up");
});
document.addEventListener("keyup", (e) => {
  try {
    if (e.code === "Backspace") {
      let backspaceKeyPressed = fabricCanvas.getActiveObject();
      fabricCanvas.remove(backspaceKeyPressed);
      fabricCanvas.renderAll();
    }
  } catch (err) {
    console.log(err);
  }
});
const downloadImage = document.querySelector("#download-id");
downloadImage.addEventListener("click", (e) => {
  fabricCanvas.discardActiveObject();
  let sel = new fabric.ActiveSelection(fabricCanvas.getObjects(), {
    canvas: fabricCanvas,
  });
  fabricCanvas.setActiveObject(sel);
  fabricCanvas.requestRenderAll();
  e.target.href = fabricCanvas.getActiveObject().toDataURL({
    withoutTransform: true,
  });
  e.target.download = "output.png";
});
/* {
    "smileys": ["😀","😃","😄","😁","😆","😅","😂","🤣","🥲","🥹","😊","😇",
    "🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪",
    "🤨","🧐","🤓","😎","🥸","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️",
    "😣","😖","😫","😩","🥺","😢","😭","😮‍💨","😤","😠","😡","🤬","🤯","😳","🥵",
    "🥶","😱","😨","😰","😥","😓","🫣","🤗","🫡","🤔","🫢","🤭","🤫","🤥","😶",
    "😶‍🌫️","😐","😑","😬","🫨","🫠","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤",
    "😪","😵","😵‍💫","🫥","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈",
    "👿","👹","👺","🤡","💩","👻","💀","☠️","👽","👾","🤖","🎃","😺","😸","😹",
    "😻","😼","😽","🙀","😿","😾"],
    "hearts": ["🩷","🧡","💛","💚","💙","🩵","💜","🖤","🩶","🤍","🤎","❤️‍🔥","❤️‍🩹",
    "💔","💕","💞","💓","💗","💖","💘","💝"]}*/
const aiTools = document.querySelector("#ai-tools");
const suiteAiTools = document.querySelector("#id-suite-ai-tools");
aiTools.addEventListener("click", () => {
  suiteAiTools.classList.add("show");
  aiTools.classList.add("hide");
});
const closeCross = document.querySelector("#close-cross-id");
closeCross.addEventListener("click", () => {
  suiteAiTools.classList.remove("show");
  aiTools.classList.remove("hide");
});
const generateImage = document.querySelector("#generate-image-btn");
const generateImageTextarea = document.querySelector(
  "#generate-image-textarea"
);
generateImage.addEventListener("click", async () => {});
const removeAiBtn = document.querySelector("#remove-ai-btn");
removeAiBtn.addEventListener("click", async () => {});
