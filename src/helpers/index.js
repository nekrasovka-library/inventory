const root = document.getElementById("root");

const addFixed = () => {
  root.classList.add("root-fixed");
};

const delFixed = () => {
  root.classList.remove("root-fixed");
};

export { addFixed, delFixed };
