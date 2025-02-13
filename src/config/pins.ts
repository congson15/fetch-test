import { GAME } from ".";

const { PINS_LEVEL_COUNT, PIN_START_Y, PIN_VERTICAL_GAP, PIN_SIZE, PIN_HORIZONTAL_GAP } = GAME;
export const PINS_POSITIONS = Array.from({ length: PINS_LEVEL_COUNT }, (_, levelIndex) => {
    const level = levelIndex + 1;

    const pinCount = 3 + (level - 1);

    const levelY = PIN_START_Y + (PIN_VERTICAL_GAP + PIN_SIZE) * (level - 1);

    const totalPinWidth = pinCount * PIN_SIZE + (pinCount - 1) * PIN_HORIZONTAL_GAP;
    const firstPinX = (GAME.SCREEN_WIDTH - totalPinWidth) / 2;

    return Array.from({ length: pinCount }, (_, pinIndex) => ({
        x: firstPinX + pinIndex * (PIN_SIZE + PIN_HORIZONTAL_GAP),
        y: levelY,
    }));
});

export function generatePins(
) {
    return PINS_POSITIONS.flat().map((pinPosition, index) => {
        const id = index;
        return {
            id,
            size: PIN_SIZE,
            position: pinPosition,
            isHit: false
        };
    });
}