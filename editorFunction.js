
const img = document.querySelector("#img-id");
const imageLoad = document.querySelector("#load-input")
imageLoad.addEventListener("change",() =>{
    let file = imageLoad.files[0];
    img.src = URL.createObjectURL(file);
    img.addEventListener("load",() => {
        img.className = "editable-image load";
        console.log(img.className);
    });
});
