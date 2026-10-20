const printButton = document.querySelector(".print-button");
printButton.hidden = false;
printButton.addEventListener("click", () => window.print());
