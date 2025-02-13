import { TPosition } from "./common";

export type TFloor = {
    id: number;
    position: TPosition,
    color: string;
    rate: number;
    label: string;
    width: number;
    height: number;
    body: Matter.Body;
    isHit: boolean;
};