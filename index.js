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
const RIGHT_MAX = -200;
const RIGHT_BOUNCING_MAX = -210;

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

const speedCalculator = (event) => {
  // speed = distance / time
  const time = event.leaveTime - event.enterTime;
  const distance = Math.abs(event.leaveX - event.enterX);
  return distance / time;
};

const eventTypeHandler = (event, dispatch) => {
  const changedX = event.enterX - event.leaveX;
  if (changedX === 0) {
    event.type = TYPE.STAY;
  } else if (changedX > 0) {
    const speed = speedCalculator(event);
    if (speed < RETURN_SPEED_STANDARD) {
      event.type = TYPE.RETURN_TO_RIGHT;
    } else {
      event.type = TYPE.RIGHT;
    }
  } else {
    const speed = speedCalculator(event);
    if (speed < RETURN_SPEED_STANDARD) {
      event.type = TYPE.RETURN_TO_LEFT;
    } else {
      event.type = TYPE.LEFT;
    }
  }
  dispatch(event.type);
};

const mouseDownEventListener = (e) => {
  mouseEnter.enterTime = e.timeStamp;
  mouseEnter.enterX = e.x;
  mouseEnter.isClicked = true;
};

const mouseUpEventListener = (e) => {
  mouseEnter.leaveTime = e.timeStamp;
  mouseEnter.leaveX = e.x;
  mouseEnter.isClicked = false;
  eventTypeHandler(mouseEnter, watchTypeChange);
};

const mouseMoveEventListener = (e) => {
  if (mouseEnter.isClicked) {
    const standardX = mouseEnter.enterX;
    // position += standardX - e.x;
    const movePercent = ((standardX - e.x) / 500) * 180;
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

// events
elScrollContainer.addEventListener("mousedown", mouseDownEventListener);
elScrollContainer.addEventListener("mouseup", mouseUpEventListener);
elScrollContainer.addEventListener("mousemove", mouseMoveEventListener);
elScrollContainer.addEventListener("mouseleave", mouseUpEventListener);
