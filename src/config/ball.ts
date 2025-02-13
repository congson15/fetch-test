import { GAME } from ".";
import { TBall } from "../types/ball";
import { generateUniqueId } from "../utils";

export function generateBall(): TBall {
    const id = generateUniqueId();
    const centerX = (GAME.SCREEN_WIDTH - GAME.BALL_SIZE) / 2;
    const leftX = centerX - GAME.BALL_SIZE;
    const rightX = centerX + GAME.BALL_SIZE;

    const positions = [leftX, centerX, rightX];
    const positionX = positions[Math.floor(Math.random() * positions.length)];

    const position = {
        x: positionX,
        y: -50
    };

    return {
        id,
        position,
        size: GAME.BALL_SIZE,
        body: null
    };
};