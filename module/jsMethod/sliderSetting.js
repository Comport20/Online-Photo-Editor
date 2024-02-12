import domObjects from "../jsObjects/documentObject";
import mapFilter from "../jsObjects/mapFilter";
export function sliderRangeMinus100toPlus100(filterName) {
  domObjects.slider.min = -100;
  domObjects.slider.max = 100;
  domObjects.slider.value = mapFilter.get(filterName).value;
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
}
export function sliderRangeZerotoPlus100(filterName) {
  domObjects.slider.min = 0;
  domObjects.slider.max = 100;
  domObjects.slider.value = mapFilter.get(filterName).value;
  domObjects.rangeValueDisplay.value = domObjects.slider.value;
}
