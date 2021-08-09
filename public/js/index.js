// !navbar

const navItems = document.querySelector(".nav-items");
const hamburger = document.querySelector(".hamburger");
const main = document.querySelector("main");
// console.log(main);
// console.log(navItems);
// console.log(hamburger);

hamburger.addEventListener("click", (e) => {
  navItems.classList.toggle("active");
});
