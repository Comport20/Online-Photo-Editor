import mapFilter from "../entities/mapFilter.js";
export function resetMapFilter(obj) {
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
