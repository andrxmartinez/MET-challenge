const baseURL =
  "https://collectionapi.metmuseum.org/public/collection/v1/search?q=sunflowers";

const searchURL =
  "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

const departmentURL =
  "https://collectionapi.metmuseum.org/public/collection/v1/departments";

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

function getParams(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

const departmentId = getParams("department");
const searchString = getParams("q");

fetch(
  `https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${departmentId}&q=${searchString}`
)
  .then(convertToJson)
  .then((data) => data.objectIDs)
  .then((objectIds) => {
    let display = document.getElementById("display");

    objectIds.slice(0, 20).forEach((id) => {
      fetch(searchURL + id)
        .then(convertToJson)
        .then((data) => {
          let img = document.createElement("img");
          img.src = data.primaryImageSmall;
          display.appendChild(img);
        });
    });
  });

function getDepartments() {
  return fetch(departmentURL)
    .then(convertToJson)
    .then((data) => data.departments)
    .then((departments) => {
      let selectElement = document.getElementById("department");
      departments.forEach((department) => {
        let option = document.createElement("option");
        option.value = department.departmentId;
        option.innerHTML = department.displayName;
        selectElement.appendChild(option);
      });
    });
}

getDepartments();
