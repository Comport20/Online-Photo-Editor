import mapFilter from "../entities/mapFilter.js";
export function applyFilter(indexFilter, fabricCanvas) {
  let obj = fabricCanvas.getActiveObject();
  let filterSetting = mapFilter.get(indexFilter).filter;
  let filterValue = Number(mapFilter.get(indexFilter).value);
  switch (indexFilter) {
    case "brightness":
      filterSetting.brightness = filterValue / 400.0;
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
