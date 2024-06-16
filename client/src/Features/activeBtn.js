export const activeFiled = (filed) => {
  const domFilterButtons = document.querySelector(".filter-button");
  for (let node of domFilterButtons.children) {
    node.classList.remove("activeBtn");
    console.log();
  }
  filed.classList.add("activeBtn");
};
