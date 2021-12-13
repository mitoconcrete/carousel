// elements
const elScrollContainer = document.getElementById(
  "container__carousel--scrolling"
);

const TYPE = {
  STAY: "STAY",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  RETURN_TO_LEFT: "RETURN_TO_LEFT",
  RETURN_TO_RIGHT: "RETURN_TO_RIGHT",
};

const RETURN_SPEED_STANDARD = 0.2;
const MOVE_POSITION_STANDARD = 100;
const LEFT_MAX = 0;
const LEFT_BOUNCING_MAX = 10;
const RIGHT_MAX = -500;
const RIGHT_BOUNCING_MAX = -510;

// stores
const mouseEnter = {
  enterTime: 0,
  leaveTime: 0,
  enterX: 0,
  leaveX: 0,
  isClicked: false,
  type: TYPE.STAY,
};
let position = 0;

// methods
const watchTypeChange = (type) => {
  if (type === TYPE.RIGHT) {
    position -= MOVE_POSITION_STANDARD;
    position = Math.max(position, RIGHT_MAX);
    elScrollContainer.style.transform = `translateX(${position}%)`;
  } else if (type === TYPE.LEFT) {
    position += MOVE_POSITION_STANDARD;
    position = Math.min(position, LEFT_MAX);
    elScrollContainer.style.transform = `translateX(${position}%)`;
  } else {
    elScrollContainer.style.transform = `translateX(${position}%)`;
  }
};

const speedCalculator = (payload) => {
  // speed = distance / time
  const time = payload.leaveTime - payload.enterTime;
  const distance = Math.abs(payload.leaveX - payload.enterX);
  return distance / time;
};

const eventTypeHandler = (payload, dispatch) => {
  const changedX = payload.enterX - payload.leaveX;
  if (changedX === 0) {
    payload.type = TYPE.STAY;
  } else if (changedX > 0) {
    const speed = speedCalculator(payload);
    if (speed < RETURN_SPEED_STANDARD) {
      payload.type = TYPE.RETURN_TO_RIGHT;
    } else {
      payload.type = TYPE.RIGHT;
    }
  } else {
    const speed = speedCalculator(payload);
    if (speed < RETURN_SPEED_STANDARD) {
      payload.type = TYPE.RETURN_TO_LEFT;
    } else {
      payload.type = TYPE.LEFT;
    }
  }
  dispatch(payload.type);
};

const mouseDownEventListener = (e) => {
  mouseEnter.enterTime = e.timeStamp;
  mouseEnter.enterX = e.x || e.changedTouches[0].clientX;
  mouseEnter.isClicked = true;
};

const mouseUpEventListener = (e) => {
  mouseEnter.leaveTime = e.timeStamp;
  mouseEnter.leaveX = e.x || e.changedTouches[0].clientX;
  mouseEnter.isClicked = false;
  eventTypeHandler(mouseEnter, watchTypeChange);
};

const mouseMoveEventListener = (e) => {
  const x = e.x || e.changedTouches[0].clientX;
  if (mouseEnter.isClicked) {
    const standardX = mouseEnter.enterX;
    const movePercent = ((standardX - x) / 500) * 180;
    let translatePercent = position + movePercent * -1;
    if (translatePercent < 0) {
      translatePercent = Math.max(translatePercent, RIGHT_BOUNCING_MAX);
    } else {
      translatePercent = Math.min(translatePercent, LEFT_BOUNCING_MAX);
    }
    elScrollContainer.style.transform = `translateX(${translatePercent}%)`;
  }
  return;
};

const touchStartEventListener = (e) => {
  mouseDownEventListener(e);
};

const touchEndEventListener = (e) => {
  mouseUpEventListener(e);
};

const touchMoveEventListener = (e) => {
  mouseMoveEventListener(e);
};

const isMobile = () => {
  const UserAgent = navigator.userAgent;
  if (
    UserAgent.match(
      /iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i
    ) != null ||
    UserAgent.match(/LG|SAMSUNG|Samsung/) != null
  ) {
    return true;
  } else {
    return false;
  }
};

// events
if (!isMobile()) {
  elScrollContainer.addEventListener("mousedown", mouseDownEventListener);
  elScrollContainer.addEventListener("mouseup", mouseUpEventListener);
  elScrollContainer.addEventListener("mousemove", mouseMoveEventListener);
  elScrollContainer.addEventListener("mouseleave", mouseUpEventListener);
} else {
  elScrollContainer.addEventListener("touchstart", touchStartEventListener);
  elScrollContainer.addEventListener("touchend", touchEndEventListener);
  elScrollContainer.addEventListener("touchmove", touchMoveEventListener);
}
