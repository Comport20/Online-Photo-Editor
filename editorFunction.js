const domObjects = {
  img: document.querySelector("#img-id"),
  imageLoad: document.querySelector("#load-input"),
  brightness: document.querySelector("[id='0']"),
  blurFilter: document.querySelector("[id='1']"),
  contrast: document.querySelector("[id='2']"),
  pixelate: document.querySelector("[id='3']"),
  vibrance: document.querySelector("[id='4']"),
  opacity: document.querySelector("[id='5']"),
  saturate: document.querySelector("[id='6']"),
  noise: document.querySelector("[id='7']"),
  filterButton: document.querySelector(".filter-button"),
  rangeValueDisplay: document.querySelector(".range-value-display"),
  slider: document.querySelector(".slider"),
  resetBtnFilter: document.querySelector(".reset-filter-btn"),
  ratio: document.querySelector("#ratio"),
  makeCrop: document.querySelector("#make-crop"),
  transform: document.querySelector("#transform"),
  rotatePlus45: document.querySelector("#btn-rotate-plus90"),
  rotateMinus45: document.querySelector("#btn-rotate-minus90"),
  mirror: document.querySelector("#mirror"),
  flip: document.querySelector("#flip"),
  cropReset: document.querySelector("#crop-reset-btn"),
  canvas: document.querySelector(".canvas-style"),
};
let changer;
let backupImage = [];
let activeObjectMap = new Map();
const fabricCanvas = new fabric.Canvas(domObjects.canvas);
(function () {
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
})();
const mapFilter = new Map([
  [
    "brightness",
    {
      filter: new fabric.Image.filters.Brightness(),
      value: 0,
      default: 0,
    },
  ],
  [
    "blur",
    {
      filter: new fabric.Image.filters.Blur(),
      value: 0,
      default: 0,
    },
  ],
  [
    "contrast",
    {
      filter: new fabric.Image.filters.Contrast(),
      value: 0,
      default: 0,
    },
  ],
  [
    "pixelate",
    {
      filter: new fabric.Image.filters.Pixelate(),
      value: 1,
      default: 1,
    },
  ],
  [
    "vibrance",
    {
      filter: new fabric.Image.filters.Vibrance(),
      value: 0,
      default: 0,
    },
  ],
  [
    "opacity",
    {
      value: 100,
      default: 100,
    },
  ],
  [
    "saturation",
    {
      filter: new fabric.Image.filters.Saturation(),
      value: 0,
      default: 0,
    },
  ],
  [
    "noise",
    {
      filter: new fabric.Image.filters.Noise(),
      value: 0,
      default: 0,
    },
  ],
]);
function applyFilter(indexFilter) {
  let obj = fabricCanvas.getActiveObject();
  let filterSetting = mapFilter.get(indexFilter).filter;
  let filterValue = Number(mapFilter.get(indexFilter).value);
  switch (indexFilter) {
    case "brightness":
      filterSetting.brightness = filterValue / 500.0;
      break;
    case "blur":
      filterSetting.blur = filterValue / 100.0;
      break;
    case "contrast":
      filterSetting.contrast = filterValue / 200.0;
      break;
    case "pixelate":
      filterSetting.blocksize = filterValue;
      break;
    case "vibrance":
      filterSetting.vibrance = filterValue / 40;
      break;
    case "opacity":
      obj.opacity = filterValue / 100.0;
      break;
    case "saturation":
      filterSetting.saturation = filterValue / 100.0;
      break;
    case "noise": {
      filterSetting.noise = filterValue;
      break;
    }
  }
  obj.applyFilters();
  fabricCanvas.renderAll();
}
domObjects.imageLoad.addEventListener("change", (e) => {
  let file = domObjects.imageLoad.files[0];
  let loadImage = new Image();
  loadImage.src = URL.createObjectURL(file);
  loadImage.addEventListener("load", () => {
    initializeImage(loadImage);
    setTimeout(function () {
      pushFilter(fabricCanvas.getActiveObject());
    }, 500);
  });
  if (e.target.value) e.target.value = "";
});
function initializeImage(loadImage) {
  let scale = imgScale(loadImage.width, loadImage.height);
  fabric.Image.fromURL(loadImage.src, function (img) {
    activeObjectMap.set(img, backupImage.length);
    backupImage.push(loadImage);
    img.scale(scale);
    fabricCanvas.add(img);
    fabricCanvas.setActiveObject(img);
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
domObjects.slider.addEventListener("change", (event) => {
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
    applyFilter(changer);
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
function sliderRangeMinus100toPlus100(filterName) {
  domObjects.slider.min = -100;
  domObjects.slider.max = 100;
  domObjects.slider.value = mapFilter.get(filterName).value;
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
}
function sliderRangeZerotoPlus100(filterName) {
  domObjects.slider.min = 0;
  domObjects.slider.max = 100;
  domObjects.slider.value = mapFilter.get(filterName).value;
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
}
const filterChanger = (str) => str;
domObjects.resetBtnFilter.addEventListener("click", () => {
  let obj = fabricCanvas.getActiveObject();
  resetMapFilter(obj);
  fabricCanvas.renderAll();
});
function resetMapFilter(obj) {
  for (const [key, value] of mapFilter) {
    let filterSetting = value.filter;
    value.value = value.default;
    switch (key) {
      case "brightness":
        filterSetting.brightness = value.default;
        break;
      case "blur":
        filterSetting.blur = value.default;
        break;
      case "contrast":
        filterSetting.contrast = value.default;
        break;
      case "pixelate":
        filterSetting.blocksize = value.default;
        break;
      case "vibrance":
        filterSetting.vibrance = value.default;
        break;
      case "opacity":
        obj.opacity = value.default;
        break;
      case "saturation":
        filterSetting.saturation = value.default;
        break;
      case "noise": {
        filterSetting.noise = value.default;
        break;
      }
    }
  }
  obj.applyFilters();
}

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
  return obj;
}
function convertCropperToFabric() {}
let backupCropImage;
domObjects.transform.addEventListener("click", () => {
  convertFabricToCropper();
  backupCropImage = domObjects.img.src;
  let cropper = new Cropper(domObjects.img, {
    aspectRatio: 0,
    viewMode: 2,
    autoCropArea: 1,
    ready: () => {
      domObjects.makeCrop.addEventListener("click", () => {
        if (cropper !== null && cropper !== undefined) {
          cropper.move(100);
          // domObjects.img.src = cropper
          //   .getCroppedCanvas({
          //     imageSmoothingEnabled: true,
          //     imageSmoothingQuality: "high",
          //   })
          //   .toDataURL();
          // cropper.destroy();
          // cropper = null;
          cropper.crop();
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
