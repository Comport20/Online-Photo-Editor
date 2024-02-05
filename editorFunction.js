
/*
invert 0 - 100% def 0
sepia 0 - 100% def 0
grayscale 0 - 100 % def 0
opacity 0 - 100% def 100
contrast 0 - 200% def 100
brightness 0 - 200% def 100
saturate 0 - 200% def 100
blur value px def 0
*/
const img = document.querySelector("#img-id");
const imageLoad = document.querySelector("#load-input")
const brightness = document.querySelector("[id='0']");
const blurFilter = document.querySelector("[id='1']");
const contrast = document.querySelector("[id='2']");
const grayscale = document.querySelector("[id='3']");
const invert = document.querySelector("[id='4']");
const opacity = document.querySelector("[id='5']");
const saturate = document.querySelector("[id='6']");
const sepia = document.querySelector("[id='7']");
const filterButton = document.querySelector(".filter-button");
const rangeValueDisplay = document.querySelector(".range-value-display");
const slider = document.querySelector(".slider");
const resetBtn = document.querySelector(".reset-btn") ;
const ratio = document.querySelector("#ratio");
const cropMode = document.querySelector("#crop-mode"); 
let changer;
rangeValueDisplay.value = slider.value;
let copyImg;
const mapFilter = new Map([
  ["brightness",100],
  ["blurFilter",0],
  ["contrast",100],
  ["grayscale",0],
  ["invert",0],
  ["opacity",100],
  ["saturate",100],
  ["sepia",0]]);
function applyFilter(){
    img.style.filter = `brightness(${mapFilter.get("brightness")}%) blur(${mapFilter.get("blurFilter")}px)
     contrast(${mapFilter.get("contrast")}%) grayscale(${mapFilter.get("grayscale")}%) 
     invert(${mapFilter.get("invert")}%) opacity(${mapFilter.get("opacity")}%) 
     saturate(${mapFilter.get("saturate")}%) sepia(${mapFilter.get("sepia")}%)`
}
function transformImage(){}
imageLoad.addEventListener("change",() =>{
    let file = imageLoad.files[0];
    img.src = URL.createObjectURL(file);
    img.addEventListener("load",() => {
        img.className = "editable-image load";
        applyFilter();
    });
});

slider.addEventListener("change", (event) =>{
  rangeValueDisplay.value = event.target.value;
  if(typeof changer !== 'undefined') {
      mapFilter.set(changer,event.target.value);
      applyFilter();
  }
});

rangeValueDisplay.addEventListener("change", (event) =>{
  let rangeValue = Number(event.target.value);
  if(isNaN(rangeValue))
  return;
  slider.value = event.target.value;
  if(typeof changer !== 'undefined') {
      mapFilter.set(changer, event.target.value);
      applyFilter();
  }
});

filterButton.addEventListener("click", e => {
  let id = e.target.id;
  switch(id){
    case brightness.id:{
      let filterName = brightness.name;
      slider.min = 0;
      slider.max = 200;
      slider.value = mapFilter.get(filterName);
      rangeValueDisplay.value = slider.value;
      changer = filterChanger(filterName);
      break; 
    }
    case blurFilter.id:{
      slider.min = 0;
      slider.max = 10;
      slider.value = mapFilter.get("blurFilter");
      rangeValueDisplay.value = slider.value;
      changer = filterChanger("blurFilter");
      break;
    }
    case contrast.id:{
      let filterName = contrast.name;
      slider.min = 0;
      slider.max = 200;
      slider.value = mapFilter.get(filterName);
      rangeValueDisplay.value = slider.value;
      changer = filterChanger(filterName);
      break;
    }
    case grayscale.id:{
      let filterName = grayscale.name;
      slider.min = 0;
      slider.max = 100;
      slider.value = mapFilter.get(filterName);
      rangeValueDisplay.value = slider.value;
      changer = filterChanger(filterName);
      break;
    }
    case invert.id:{
      let filterName = invert.name;
      slider.min = 0;
      slider.max = 100;
      slider.value = mapFilter.get(filterName);
      rangeValueDisplay.value = slider.value;
      changer = filterChanger(filterName);
      break; 
    }
    case opacity.id:{
      let filterName = opacity.name;
      slider.min = 0;
      slider.max = 100;
      slider.value = mapFilter.get(filterName);
      rangeValueDisplay.value = slider.value;
      changer = filterChanger(filterName);
      break;
    }
    case saturate.id:{
      let filterName = saturate.name;
      slider.min = 0;
      slider.max = 200;
      slider.value = mapFilter.get(filterName);
      rangeValueDisplay.value = slider.value;
      changer = filterChanger(filterName);
      break;
    }
    case sepia.id:{
      let filterName = sepia.name;
      slider.min = 0;
      slider.max = 100;
      slider.value = mapFilter.get(filterName);
      rangeValueDisplay.value = slider.value;
      changer = filterChanger(filterName);
      break;
    }
  }
});
const filterChanger = (str) => str;
resetBtn.addEventListener("click", () =>{
  mapFilter.set("brightness",100);
  mapFilter.set("blurFilter",0);
  mapFilter.set("grayscale",0);
  mapFilter.set("invert",0);
  mapFilter.set("opacity",100);
  mapFilter.set("saturate",100);
  mapFilter.set("sepia",0);
  applyFilter()
});
cropMode.addEventListener("click", () =>{
  copyImg = new Image();
  copyImg.src = img.src;
})
ratio.addEventListener("click", () =>{
  const cropper = new Cropper(img,{
    aspectRatio: 5/4,
    ready: function () {
        let newCrop = cropper.getCroppedCanvas().toDataURL();
        img.src = newCrop;
        cropper.destroy();
    } 
  });
});
const makeCrop = document.querySelector("#make-crop")
const crop = document.querySelector("#crop");
const rotatePlus90 = document.querySelector("#btn-rotate-plus90");
const rotateMinus90 = document.querySelector("#btn-rotate-minus90");
crop.addEventListener("click", () =>{ 
  let cropper = new Cropper(img,{
    aspectRatio: 0,
    viewMode: 2,
    autoCropArea: 1,
    ready: () => {
      makeCrop.addEventListener("click", () =>{
        if(cropper !== null && cropper !== undefined){
          img.src = cropper.getCroppedCanvas().toDataURL();
          cropper.destroy();
          cropper = null;
        }
    })
    rotatePlus90.addEventListener("click", () => {
      if(cropper !== null && cropper !== undefined){
        cropper.rotate(90);
        img.src = cropper.getCroppedCanvas().toDataURL();
        cropper.destroy();
        cropper = null;
      }
    });
    rotateMinus90.addEventListener("click",() => {
      if(cropper !== null && cropper !== undefined){
        cropper.rotate(-90);
        img.src = cropper.getCroppedCanvas().toDataURL();
        cropper.destroy();
        cropper = null;
        }
    });
  }});
});

const cropReset = document.querySelector("#crop-reset-btn");
cropReset.addEventListener("click", () =>{
  img.src = copyImg.src;
  crop.dispatchEvent(new Event("click"))
});