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
import { activeFiled } from "../../Features/activeBtn.js";
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
  fabric.Image.fromURL(loadImage.src, async function (img) {
    activeObjectMap.set(img, backupImage.length);
    backupImage.push(loadImage);
    img.scale(scale);
    fabricCanvas.centerObject(img);
    fabricCanvas.add(img);
    fabricCanvas.setActiveObject(img);
    pushFilter(fabricCanvas.getActiveObject());
  });
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
  activeFiled(domObjects.brightness);
});
domObjects.blurFilter.addEventListener("click", () => {
  sliderRangeZerotoPlus100("blur");
  changer = filterChanger("blur");
  activeFiled(domObjects.blurFilter);
});
domObjects.contrast.addEventListener("click", () => {
  let filterName = domObjects.contrast.name;
  sliderRangeMinus100toPlus100(filterName);
  changer = filterChanger(filterName);
  activeFiled(domObjects.contrast);
});
domObjects.pixelate.addEventListener("click", () => {
  let filterName = domObjects.pixelate.name;
  domObjects.slider.min = 1;
  domObjects.slider.max = 25;
  domObjects.slider.value = mapFilter.get(filterName).value;
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
  changer = filterChanger(filterName);
  activeFiled(domObjects.pixelate);
});
domObjects.vibrance.addEventListener("click", () => {
  let filterName = domObjects.vibrance.name;
  sliderRangeMinus100toPlus100(filterName);
  changer = filterChanger(filterName);
  activeFiled(domObjects.vibrance);
});
domObjects.opacity.addEventListener("click", () => {
  let filterName = domObjects.opacity.name;
  sliderRangeZerotoPlus100(filterName);
  changer = filterChanger(filterName);
  activeFiled(domObjects.opacity);
});
domObjects.saturate.addEventListener("click", () => {
  let filterName = domObjects.saturate.name;
  sliderRangeMinus100toPlus100(filterName);
  changer = filterChanger(filterName);
  activeFiled(domObjects.saturate);
});
domObjects.noise.addEventListener("click", () => {
  let filterName = domObjects.noise.name;
  sliderRangeZerotoPlus100(filterName);
  changer = filterChanger(filterName);
  activeFiled(domObjects.noise);
});
const filterChanger = (str) => str;
domObjects.resetBtnFilter.addEventListener("click", () => {
  let obj = fabricCanvas.getActiveObject();
  resetMapFilter(obj);
  fabricCanvas.renderAll();
});
const resetBtnSideMenu = document.querySelector("#traget-rest-id");
resetBtnSideMenu.addEventListener("click", () => {
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
  if (cropper) cropper.destroy();
}
let cropper;
let converterFlag = true;
let backupCropImage;
domObjects.transform.addEventListener("click", () => {
  toggleFlagHiddenSlider(sliderArea, cropperButtons, "cropper-button");
  scrollToNewItem(cropperButtons);
  if (converterFlag) {
    convertFabricToCropper();
    backupCropImage = domObjects.img.src;
  }
  cropper = new Cropper(domObjects.img, {
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
    let activeObj = fabricCanvas.getActiveObject();
    if (e.target.checked) {
      let filterCreator = new Function(
        `return new fabric.Image.filters.${e.target.dataset.filterName}();`
      );
      let filtersSetting = filterCreator();
      if (arrayValue.has(e.target.dataset.filterName)) {
        activeObj.filters[arrayValue.get(e.target.dataset.filterName)] =
          filtersSetting;
      } else {
        arrayValue.set(e.target.dataset.filterName, counter);
        activeObj.filters[counter++] = filtersSetting;
      }
      activeObj.applyFilters();
      fabricCanvas.renderAll();
    } else {
      activeObj.filters.splice(arrayValue.get(e.target.dataset.filterName), 1);
      activeObj.applyFilters();
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
  fabricCanvas.insertAt(fabricText, 3, false);
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
let canvasMouse = true;
function handler(event) {
  if (event.type == "mouseout") {
    canvasMouse = false;
  }
  if (event.type == "mouseover") {
    canvasMouse = true;
  }
}
const canvasContainer = document.querySelector(".canvas-container");
canvasContainer.addEventListener("mouseover", (event) => {
  handler(event);
});
canvasContainer.addEventListener("mouseout", (event) => {
  handler(event);
});
const deletePhoto = () => {
  let backspaceKeyPressed = fabricCanvas.getActiveObject();
  fabricCanvas.remove(backspaceKeyPressed);
  fabricCanvas.renderAll();
};
document.addEventListener("keyup", (e) => {
  try {
    if (canvasMouse) {
      if (e.code === "Backspace") {
        deletePhoto();
      }
    }
  } catch (err) {
    console.log(err);
  }
});
document.addEventListener("paste", (event) => {
  if (canvasMouse) {
    let items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    console.log(JSON.stringify(items)); // will give you the mime types
    for (let index in items) {
      let item = items[index];
      if (item.kind === "file") {
        let blob = item.getAsFile();
        let reader = new FileReader();
        reader.onload = function (event) {
          const image = new Image();
          image.src = event.target.result;
          initializeImage(image);
        };
        reader.readAsDataURL(blob);
      }
    }
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
const styleList = document.querySelector("#style-list");
generateImage.addEventListener("click", () => {
  const url = "http://127.0.0.1:8000/ai/generate/model";
  const requestBody = {
    prompt: generateImageTextarea.value,
    style: styleList.value,
  };
  const response = generateImagePost(url, requestBody);
  response
    .then((responseData) => responseData.json())
    .then((data) => {
      const generateImage = new Image();
      const base64Value = data[0].image;
      generateImage.src = `data:image/png;base64,${base64Value.replace(
        /[\[\]']+/g,
        ""
      )}`;
      generateImage.onload = () => {
        initializeImage(generateImage);
      };
    });
});
function generateImagePost(url, requestBody) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
}
const removeAiBtn = document.querySelector("#remove-ai-btn");
removeAiBtn.addEventListener("click", async () => {
  const removeBgImage = fabricCanvas
    .getActiveObject()
    .toDataURL({
      withoutTransform: true,
    })
    .replace(/^data:image\/[a-z]+;base64,/, "");
  const url = "http://localhost:8000/ai/remove/bg";
  const json = { base64: removeBgImage, uid: generateUid() };
  console.log(json);
  postHandlerRemoveBg(url, json);
});
function postHandlerRemoveBg(url, json) {
  const response = removeBgPost(url, json);
  response
    .then((res) => res.blob())
    .then((imageData) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(imageData);
      return fileReader;
    })
    .then((srcBase64) => {
      const imageWithoutBg = new Image();
      srcBase64.onload = () => {
        imageWithoutBg.src = srcBase64.result;
      };
      imageWithoutBg.onload = () => {
        deletePhoto();
        initializeImage(imageWithoutBg);
      };
    })
    .catch((rej) => alert(rej));
}
function removeBgPost(url, json) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });
}
function generateUid() {
  return Math.floor(Math.random() * 10000) + new Date().getTime() + "";
}
const createAiBtn = document.querySelector("#create-ai-btn");
const aiArrow = document.querySelector("#ai-arrow-id");

const funcBlockCreateImage = document.querySelector(
  "#func-block-create-image-id"
);
const createImageBlock = document.querySelector(".create-image-block");
createAiBtn.addEventListener("click", (e) => {
  aiArrow.classList.toggle("up");
  createImageBlock.classList.toggle("increased-height");
  funcBlockCreateImage.classList.toggle("show");
});
export default fabricCanvas;
export { removeBgPost };
export { generateImagePost };
