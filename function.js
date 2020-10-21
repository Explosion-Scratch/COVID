axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    preloader.classList.add("preloader--hidden");
    alert(error);
    return Promise.reject(error);
  }
);

var preloader = document.querySelector(".preloader");

axios.interceptors.response.use(
  function (response) {
    preloader.classList.add("preloader--hidden");
    return response;
  },
  function (error) {
    preloader.classList.add("preloader--hidden");
    alert(error);
    return Promise.reject(error);
  }
);

function getGlobalData() {
  return axios.get("https://corona.lmao.ninja/v2/all");
}

function getCountriesData() {
  return axios.get("https://corona.lmao.ninja/v2/countries");
}

axios
  .all([getGlobalData(), getCountriesData()])
  .then(
    axios.spread(function (global, countries) {
      //global
      console.log("%c全球 Global", "color: #fb5e53");
      console.log("確診 Cases", global.data.cases);
      console.log("死亡 Deaths", global.data.deaths);
      console.log("康復 Recovered", global.data.recovered);

      var totalCases = global.data.cases.toLocaleString();
      var totalDeaths = global.data.deaths.toLocaleString();
      var totalRecovered = global.data.recovered.toLocaleString();

      document.getElementsByClassName(
        "global__cases"
      )[0].childNodes[1].innerHTML = totalCases;
      document.getElementsByClassName(
        "global__recovered"
      )[0].childNodes[1].innerHTML = totalRecovered;
      document.getElementsByClassName(
        "global__deaths"
      )[0].childNodes[1].innerHTML = totalDeaths;

      //countries
      const tbody = document.getElementsByTagName("tbody")[0];
      var countries = countries.data;
      countries.forEach(function (element, index, array) {
        const tr = document.createElement("tr");
        // 國旗 flag
        const img = document.createElement("img");
        img.src = element.countryInfo.flag;
        img.alt = element.countryInfo.iso2;
        img.setAttribute("title", element.countryInfo.iso2);
        var values = [
          element.country,
          element.cases,
          element.deaths,
          element.recovered
        ];
        values.forEach(function (element, index, array) {
          const td = document.createElement("td");
          element =
            validation.isNumber(element) === "NaN"
              ? element
              : element.toLocaleString();
          if (!index) {
            let text = document.createTextNode(element);
            td.appendChild(img);
            td.appendChild(text);
          } else {
            td.innerHTML = element;
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    })
  )
  .catch(function (error) {
    console.log(error);
  });

var validation = {
  isNumber: function (str) {
    //  /^\d+$/g is equal to /^[0-9]+$/g;
    var patt = /^\d+$/g;
    return patt.test(str);
  }
};

var search = document.getElementById("search");
search.addEventListener("keyup", function () {
  var value = this.value.toLowerCase();
  console.log("value", value);
  const rows = document.querySelectorAll("tbody tr");
  const rowsArray = Array.prototype.slice.call(rows);
  rowsArray.forEach(function (element, index, array) {
    var tdCountry = element.childNodes[0].innerHTML.toLowerCase();
    if (tdCountry.indexOf(value) > -1) {
      //console.log(tdCountry, tdCountry.indexOf(value));
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });
});

function changeOrder() {
  const value = document.getElementById("select").value;
  const index = document.getElementById("select").selectedIndex;
  //console.log(value, index);
  const rows = document.querySelectorAll("tbody tr");
  const rowsArray = Array.prototype.slice.call(rows);
  rowsArray
    .sort(function (A, B) {
      var num1 = A.childNodes[index].innerHTML;
      num1 = num1.replace(",", "");
      var num2 = B.childNodes[index].innerHTML;
      num2 = num2.replace(",", "");
      return num2 - num1;
    })
    .forEach(function (tr) {
      tr.parentElement.appendChild(tr);
    });
  //console.log(rowsArray);
}
document.querySelector(".arrow__up").addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

document.querySelector(".arrow__down").addEventListener("click", function () {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
});
