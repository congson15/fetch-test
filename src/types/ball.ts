import { TPosition } from "./common";

export type TBall = {
    id: number;
    position: TPosition;
    size: number;
    body: Matter.Body | null;
};