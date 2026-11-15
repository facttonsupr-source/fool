import { upi } from "./UPI.js";

// const msg=localStorage.getItem("alreadyFooled")
// if(msg==="ha")
const btn = document.getElementById("submitbtn");
const upiInputBox = document.getElementById("UPI");
const upiElementHolder = document.querySelector("#upiIDS");
const cashbackForm = document.querySelector("#cashbackForm");
const progressBar = document.querySelector("#progress");
const coin = document.querySelector("#coin");
const submitBtn = document.querySelector("#submitbtn");
const mainContainer = document.querySelector(".cashbackBox");
const invalidMSGElement = document.querySelector("#invalidMSG");
const progressBarParent = progressBar.parentElement;
const giltAudio = new Audio("./sound/gilt.mp3");
const lauchAudio = new Audio("./sound/lauch.mp3");
const pattern = new RegExp(/^[\w\.\-]{2,}\@/);
const upiPattern = new RegExp(`${pattern.source}(?<upiID>[a-zA-Z]+)\\s*$`);
function handleEvent(element, eventname, cb, isRemove) {
  if (element && typeof eventname === "string" && typeof cb === "function") {
    const eventHandleType = isRemove
      ? "removeEventListener"
      : "addEventListener";
    element[eventHandleType]?.(eventname, cb);
  }
}

function handleBtnElementGeneration(uID, upiIdStarter) {
  const li = document.createElement("li");
  const str = upiIdStarter + uID;
  li.insertAdjacentHTML(
    "beforeend",
    `<button title="${uID}" type="button">${str}</button>`,
  );
  return li;
}
function preventDefault(event) {
  event.preventDefault();
}
function universalClassListHandle(
  element,
  isRemove = false,
  className = "hide",
) {
  const action = isRemove ? "remove" : "add";
  element.classList[action]?.(className);
}
const mouseInfo = {
  isActive: false,
  position: null,
  initialState: 60 - 5,
  isToVerify: false,
  lastInputMSG: "",
};

function coinHandleOnMouseDown({ clientX }) {
  if (mouseInfo.isToVerify) mouseInfo.isActive = true;
  universalClassListHandle(coin, false, "coinRotate");

  if (mouseInfo.position == null) mouseInfo.position = clientX;
}
function handleSlider({ clientX, currentTarget }) {
  const { isActive, initialState, position } = mouseInfo;
  if (isActive) {
    const finalIncrease = clientX - position + initialState;
    const { width } = currentTarget.getBoundingClientRect();
    const lastBoundary = width - 10;
    const initialBoundary = initialState + 10;
    const conditionForMove =
      initialBoundary < finalIncrease && finalIncrease < lastBoundary;
    universalClassListHandle(coin, !conditionForMove, "coinRotate");
    if (conditionForMove) {
      progressBar?.style?.setProperty(
        "--widthCalculation",
        finalIncrease + "px",
      );
    } else if (initialBoundary >= finalIncrease) {
      progressBar?.style?.setProperty(
        "--widthCalculation",
        initialState + "px",
      );
    } else if (lastBoundary <= finalIncrease) {
      progressBar?.style?.setProperty("--widthCalculation", width + "px");
      handleEvent(progressBarParent, "mouseleave", handleLeave, true);
      handleEvent(coin, "mouseup", handleLeave, true);
      handleEvent(progressBarParent, "mousemove", handleSlider, true);
      handleEvent(coin, "mousedown", coinHandleOnMouseDown, true);

      handleEvent(progressBarParent, "pointerleave", handleLeave, true);
      handleEvent(coin, "pointerup", handleLeave, true);
      handleEvent(progressBarParent, "pointermove", handleSlider, true);
      handleEvent(coin, "pointerdown", coinHandleOnMouseDown, true);
      universalClassListHandle(submitBtn, true);
      mouseInfo.lastInputMSG = upiInputBox.value;
    }
  }
}
function handleLeave() {
  mouseInfo.isActive = false;
  universalClassListHandle(coin, true, "coinRotate");
}
handleEvent(progressBarParent, "mouseleave", handleLeave);
handleEvent(coin, "mouseup", handleLeave);
handleEvent(progressBarParent, "mousemove", handleSlider);
handleEvent(coin, "mousedown", coinHandleOnMouseDown);

handleEvent(progressBarParent, "pointerleave", handleLeave);
handleEvent(coin, "pointerup", handleLeave);
handleEvent(progressBarParent, "pointermove", handleSlider);
handleEvent(coin, "pointerdown", coinHandleOnMouseDown);

cashbackForm.addEventListener("submit", (e) => {
  e.preventDefault();
});
upiElementHolder.addEventListener("click", (event) => {
  const { target } = event;
  event.stopPropagation();
  if (target?.type === "button") {
    upiInputBox.value = target.textContent;
    universalClassListHandle(invalidMSGElement);
    universalClassListHandle(upiElementHolder);
    mouseInfo.isToVerify = true;
  }
});
document.body.addEventListener("click", () => {
  universalClassListHandle(upiElementHolder);
});
upiInputBox.addEventListener("click", (event) => {
  const { target } = event;
  event.stopPropagation();
  if (target?.value?.trim() != "") {
    universalClassListHandle(upiElementHolder, true);
  }
});
upiInputBox.addEventListener("input", (event) => {
  if (mouseInfo.lastInputMSG != "") {
    event.target.value = mouseInfo.lastInputMSG;
    return;
  }
  const { target } = event;
  const { value } = target;

  const { upiID } = value.match(upiPattern)?.groups ?? {};
  const wrongMSG = !(upi.includes(upiID) && value.trim() != "");
  mouseInfo.isToVerify = !wrongMSG;
  universalClassListHandle(invalidMSGElement, wrongMSG);
  if (pattern.test(value)) {
    universalClassListHandle(upiElementHolder, true);

    upiElementHolder.innerHTML = "";

    const upiFilter =
      upiID != null ? upi.filter((id) => id.startsWith(upiID)) : upi;
    const upiIdStarter = value.split("@")[0] + "@";
    const elementsFrame = upiFilter.map((uID) =>
      handleBtnElementGeneration(uID, upiIdStarter),
    );
    upiElementHolder.append(...elementsFrame);
  } else {
    universalClassListHandle(upiElementHolder);
  }
});

function playInfiniteAudio() {
  document.addEventListener("keypress", preventDefault);
  document.addEventListener("keydown", preventDefault);
  document.addEventListener("contextmenu", preventDefault);
  document.body.classList.add("hideCourser");
  document.body.classList.add("fooled");
  mainContainer.insertAdjacentHTML(
    "beforeend",
    `
    <img src="./img/qr.png" alt="cat.png" class="fooledIMG"/>

    `,
  );
  const fooledIMG = document.querySelector(".fooledIMG");
  giltAudio.volume = 1;
  lauchAudio.volume = 1;
  giltAudio.play();
  giltAudio.addEventListener("ended", async () => {
    await lauchAudio.play();
    fooledIMG.src = "./img/cat.png";
  });
  lauchAudio.addEventListener("ended", async () => {
    await giltAudio.play();
    fooledIMG.src = "./img/qr.png";
  });
}

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(console.error);
  }
});
btn.addEventListener("click", () => {
  localStorage.setItem("alreadyFooled", JSON.stringify("ha"));

  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    playInfiniteAudio();
  }
});
