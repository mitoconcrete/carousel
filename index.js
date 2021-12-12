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

const RETURN_SPEED_STANDARD = 10;
const elementWidth = 500;

// stores
const mouseEnter = {
  enterTime: 0,
  leaveTime: 0,
  enterX: 0,
  leaveX: 0,
  type: TYPE.STAY,
};
let position = 0;

// methods
const watchTypeChange = (type) => {
  console.log(type);
};

const speedCalculator = (event) => {
  // speed = time / distance
  const time = event.leaveTime - event.enterTime;
  const distance = Math.abs(event.leaveX - event.enterX);
  return time / distance;
};

const eventTypeHandler = (event, dispatch) => {
  const changedX = event.enterX - event.leaveX;
  if (changedX === 0) {
    event.type = TYPE.STAY;
  } else if (changedX > 0) {
    const speed = speedCalculator(event);
    console.log(speed);
    if (speed > RETURN_SPEED_STANDARD) {
      event.type = TYPE.RETURN_TO_LEFT;
    } else {
      event.type = TYPE.LEFT;
    }
  } else {
    const speed = speedCalculator(event);
    console.log(speed);
    if (speed > RETURN_SPEED_STANDARD) {
      event.type = TYPE.RETURN_TO_RIGHT;
    } else {
      event.type = TYPE.RIGHT;
    }
  }
  dispatch(event.type);
};

const mouseDownEventListener = (e) => {
  mouseEnter.enterTime = e.timeStamp;
  mouseEnter.enterX = e.x;
};

const mouseUpEventListener = (e) => {
  mouseEnter.leaveTime = e.timeStamp;
  mouseEnter.leaveX = e.x;

  eventTypeHandler(mouseEnter, watchTypeChange);
};

// events
elScrollContainer.addEventListener("mousedown", mouseDownEventListener);
elScrollContainer.addEventListener("mouseup", mouseUpEventListener);
