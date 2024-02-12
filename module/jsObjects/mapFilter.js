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
export default mapFilter;
