$(document).ready(() => {
  const configLink = $(".header-config");
  const fedButton = $("#mainFed");
  const prevButton = $(".previous");
  const nextButton = $(".next");

  configLink.on("click", () => {
    window.location.href = "index.php?config=true";
  });

  fedButton.on("click", () => {
    if (fedButton.text() === "Alimentei agora") {
      fedButton.text("Confirme ⚠");
    } else if (fedButton.text() === "Confirme ⚠" && !isButtonDisabled()) {
      window.location.href = "fed.php";
      setButtonDisabled();
    }
  });

  prevButton.on("click", () => {
    const day = controllerButton(getResults(), "prev");
    document.cookie = `controller_day=${day}`;
    showResults();
    setRegisterInfo();
  });

  nextButton.on("click", () => {
    const day = controllerButton(getResults(), "next");
    document.cookie = `controller_day=${day}`;
    showResults();
    setRegisterInfo();
  });

  main();
});

function main() {
  document.cookie = `controller_day=${getCurrentDateTime().slice(0, 10)}`;
  setRegisterInfo();
  conn_feedback();
  setFedButton();
  showResults();
}

function setFedButton() {
  if (isRecentlyFed() || isButtonDisabled()) {
    disableFedButton();
  } else {
    activateFedButton();
  }
}

function setRegisterInfo() {
  function formatToLocale(dayStr) {
    const year = dayStr.slice(0, 4);
    const month = dayStr.slice(5, 7);
    const day = dayStr.slice(8, 10);

    return `${day}/${month}/${year}`;
  }

  const results = getResults();
  const registerBottomDayEl = document.querySelector(".register-bottom__day");
  const size = Object.keys(results).length;

  if (size > 0) {
    const day = getCookie("controller_day");
    const date = new Date(day);
    let dayIndex = date.getDay() + 1;
    dayIndex === 7 ? (dayIndex = 0) : "";

    const daysOfWeek = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];

    const fullDay = getDateDiff(day, getCurrentDateTime().slice(0, 10));
    if (fullDay.match("-")) {
      registerBottomDayEl.innerHTML = `<span number-style>${formatToLocale(
        fullDay
      )}<span/>, ${daysOfWeek[dayIndex]}`;
    } else {
      registerBottomDayEl.textContent = `${fullDay}, ${daysOfWeek[dayIndex]}`;
    }
  } else {
    registerBottomDayEl.innerHTML = "Nenhum registro";
  }
}

function getDateDiff(date1Str, date2Str) {
  if (isWithinDaysInterval(date1Str, date2Str, 0)) {
    return "Hoje";
  } else if (isWithinDaysInterval(date1Str, date2Str, 1)) {
    return "Ontem";
  } else if (isWithinDaysInterval(date1Str, date2Str, 2)) {
    return "Anteontem";
  } else {
    return date1Str;
  }
}

function isWithinDaysInterval(date1Str, date2Str, days) {
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);

  date2.setDate(date2.getDate() - days);

  return date1 >= date2 && date1 <= new Date(date2Str);
}

function controllerButton(results, prevOrNext) {
  const controller_day = getCookie("controller_day");
  const date = new Date(controller_day);
  const availableDates =
    prevOrNext === "prev"
      ? Object.keys(results).reverse()
      : Object.keys(results);

  let find = [];
  availableDates.forEach((value, key) => {
    let availableDateStr = availableDates[key];
    let availableDate = new Date(availableDateStr);
    if (prevOrNext === "prev") {
      availableDate.getTime() < date.getTime() && !find.length > 0
        ? find.push(availableDates[key])
        : "";
    } else {
      availableDate.getTime() > date.getTime() && !find.length > 0
        ? find.push(availableDates[key])
        : "";
    }
  });

  if (find.length > 0) {
    enableButton();
    return find[0];
  } else {
    unableButton();
    return getCurrentDateTime().slice(0, 10);
  }
}

function enableButton(selector) {
  $(selector).disabled = false;
  $(selector).removeClass("disabled");
  $(selector).prop("disabled", false);
}

function unableButton(selector) {
  $(selector).disabled = true;
  $(selector).addClass("disabled");
  $(selector).prop("disabled", true);
}

function activateFedButton() {
  $("#mainFed").disabled = false;
  $("#mainFed").removeClass("disabled");
  $("#mainFed").text("Alimentei agora");
  document.cookie = "button_disabled=null";
}

function disableFedButton() {
  $("#mainFed").disabled = true;
  $("#mainFed").addClass("disabled");
  $("#mainFed").text("Alimentado ✓");
}

function setButtonDisabled() {
  currentDate = getCurrentDateTime();
  document.cookie = `button_disabled=${currentDate}`;
  disableFedButton();
}

function isRecentlyFed() {
  const results = getResults();
  const size = Object.keys(results).length;
  const day = getCurrentDateTime().slice(0, 10);

  if (size > 0 && results[day] != undefined) {
    const lastFedAt = new Date(results[day].pop().fed_at);
    const timeSinceFed = Date.now() - lastFedAt;
    return timeSinceFed < 5 * 60 * 1000;
  }
  return false;
}

function isButtonDisabled() {
  const buttonDisabled = getCookie("button_disabled");
  if (buttonDisabled != null && buttonDisabled != "null") {
    if (convertDateTimeToDate(buttonDisabled)) {
      const disabledDate = new Date(Date.parse(buttonDisabled));
      const currentTime = new Date().getTime();
      const disabledTime = disabledDate.getTime();
      const timeDiff = currentTime - disabledTime;
      const hoursDiff = Math.floor(timeDiff / 3600000);

      if (!hoursDiff >= 1) {
        return true;
      }
    }
  }
  return false;
}

function getCurrentDateTime() {
  function padNumber(num) {
    return num.toString().padStart(2, "0");
  }

  var now = new Date(Date.now());
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  var formattedDate =
    year +
    "-" +
    padNumber(month) +
    "-" +
    padNumber(day) +
    " " +
    padNumber(hour) +
    ":" +
    padNumber(minute) +
    ":" +
    padNumber(second);

  return formattedDate;
}

function convertDateTimeToDate(fullDate = null) {
  let dateString = "";
  fullDate ? (dateString = fullDate) : (dateString = getCurrentDateTime());

  if (dateString) {
    var regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
    var matches = dateString.match(regex);
    if (matches) {
      var year = parseInt(matches[1]);
      var month = parseInt(matches[2]) - 1;
      var day = parseInt(matches[3]);
      var hour = parseInt(matches[4]);
      var minute = parseInt(matches[5]);
      var second = parseInt(matches[6]);

      return new Date(year, month, day, hour, minute, second);
    }
  }

  return false;
}

function conn_feedback() {
  const urlParams = new URLSearchParams(window.location.search);
  const conn = urlParams.get("conn");
  const accepted_values = ["success", "fed_recently", "failed"];
  if (accepted_values.includes(conn)) {
    const notification = document.createElement("div");
    notification.classList.add("notification");

    if (conn === "success") {
      notification.style.backgroundColor = "var(--secondary-color)";
      notification.innerHTML =
        "<h3>Sucesso</h3><p>Registro de alimentação concluído.</p>";
    } else {
      notification.style.backgroundColor = "red";
      if (conn === "fed_recently") {
        notification.innerHTML = `<h3>Erro</h3><p>Houve um registro de alimentação dentro do intervalo de <span number-style>5<span> minutos.</p>`;
      } else if (conn === "failed") {
        notification.innerHTML = `<h3>Erro</h3><p>Houve um erro ao registrar a alimentação.</p>`;
      }
    }

    document.body.appendChild(notification);

    setTimeout(function () {
      document.body.removeChild(notification);
    }, 5000);
  }
}

function getResults() {
  const phpArrayResults = getCookie("results");
  var cookiePHP = JSON.parse(phpArrayResults);

  return cookiePHP;
}

function showResults() {
  const day = getCookie("controller_day");
  const feedArray = getResults();
  const mainFeeded = document.querySelector(".main-feeded");
  const size = Object.keys(feedArray).length;
  mainFeeded.innerHTML = "";

  if (size == 0 || feedArray[day] === undefined) {
    const noRegister = document.createElement("p");
    noRegister.classList.add("no-register");
    noRegister.textContent = "Nenhum registro de alimentação nessa data.";
    mainFeeded.appendChild(noRegister);
    return;
  }

  feedArray[day.slice(0, 10)].forEach((feed) => {
    const feededContent = document.createElement("div");
    feededContent.classList.add("main-feeded__content");

    const avatarSrc = document.createElement("img");
    avatarSrc.src = feed.avatar_src;
    avatarSrc.alt = "Usuário";
    feededContent.appendChild(avatarSrc);

    const feededContentInfo = document.createElement("div");
    feededContentInfo.classList.add("main-feeded__content-info");

    const hour = parseInt(feed.fed_at.substr(11, 8));
    const time = getFeedTime(hour);

    const feededTime = document.createElement("p");
    feededTime.classList.add("info-time");
    feededTime.innerHTML =
      `<i class="${time.icon}"></i>` +
      `${time.label} (às <span number-style>${feed.fed_at.substr(
        11,
        5
      )}</span>)`;
    feededContentInfo.appendChild(feededTime);

    const feededBy = document.createElement("p");
    feededBy.classList.add("info-feeded__by");
    feededBy.textContent = `Alimentado por ${feed.nickname}`;
    feededContentInfo.appendChild(feededBy);

    feededContent.appendChild(feededContentInfo);
    mainFeeded.appendChild(feededContent);
  });
}

function getFeedTime(hour) {
  if (hour >= 6 && hour < 12) {
    return { label: "Manhã", icon: "fa-solid fa-sun" };
  } else if (hour >= 12 && hour < 18) {
    return { label: "Tarde", icon: "fa-regular fa-sun" };
  } else if (hour >= 18 && hour < 24) {
    return { label: "Noite", icon: "fa-solid fa-moon" };
  } else {
    return { label: "Madrugada", icon: "fa-regular fa-moon" };
  }
}

function getCookie(name) {
  var pattern = RegExp(name + "=.[^;]*");
  var cookies = document.cookie;
  var match = pattern.exec(cookies);

  return match ? decodeURIComponent(match[0].split("=")[1]) : null;
}
