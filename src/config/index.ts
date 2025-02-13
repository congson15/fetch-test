export const GAME = {
    SCREEN_HEIGHT: 700,
    SCREEN_WIDTH: 700,

    //BALL CONFIG
    BALL_SIZE: 25,
    NUMBER_OF_BALLS: 50,

    //PIN CONFIG
    PINS_LEVEL_COUNT: 8,
    PIN_START_Y: 100,
    PIN_VERTICAL_GAP: 50,
    PIN_HORIZONTAL_GAP: 50,
    PIN_SIZE: 20,

    //FLOOR CONFIG
    FLOOR_WIDTH: 60,
    NUM_FLOORS: 9,
    FLOOR_HEIGHT: 40,
    FLOOR_Y: 650,
    FLOOR_HORIZONTAL_GAP: 10,
    FLOOR_VERTICAL_GAP: 30
};

export const FLOOR_RENDER = {
    "0.2": {
        label: "0.2x",
        rate: 0.2,
        color: "#FFFF33",
    },
    "0.3": {
        label: "0.3x",
        rate: 0.3,
        color: "#FF9900",
    },
    "1.5": {
        label: "1.5x",
        rate: 1.5,
        color: "#FF6600",
    },
    "4": {
        label: "4x",
        rate: 4,
        color: "#E63910",
    },
    "29": {
        label: "29x",
        rate: 29,
        color: "#B20000",
    },
};

export const PADDLE_MAP = [
    FLOOR_RENDER["29"],
    FLOOR_RENDER["4"],
    FLOOR_RENDER["1.5"],
    FLOOR_RENDER["0.3"],
    FLOOR_RENDER["0.2"],
    FLOOR_RENDER["0.3"],
    FLOOR_RENDER["1.5"],
    FLOOR_RENDER["4"],
    FLOOR_RENDER["29"],
];

