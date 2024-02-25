export function toggleFlagVisibleSlider(slider, domBlock, containStr) {
  if (slider.classList.contains("deactivate"))
    slider.classList.remove("deactivate");
  if (!active) {
    active = domBlock;
    active.classList.toggle("deactivate");
  } else if (!active.classList.contains(containStr)) {
    active.classList.toggle("deactivate");
    active = domBlock;
    active.classList.toggle("deactivate");
  }
}
export function toggleFlagHiddenSlider(slider, domBlock, containStr) {
  if (!slider.classList.contains("deactivate"))
    slider.classList.add("deactivate");
  if (!active) {
    active = domBlock;
    active.classList.toggle("deactivate");
  } else if (!active.classList.contains(containStr)) {
    active.classList.toggle("deactivate");
    active = domBlock;
    active.classList.toggle("deactivate");
  }
}
let active;
