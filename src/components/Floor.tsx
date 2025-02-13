import { TPosition } from "../types";

type TFloorProps = {
	label: string;
	width: number;
	height: number;
	position: TPosition;
	color: string;
	isHit: boolean;
};
export default function Floor(props: TFloorProps) {
	const { label, height, position, width, color, isHit } = props;
	return (
		<div
			className={`floor ${isHit ? "floor--shrink" : ""}`}
			style={{
				width: width,
				height: height,
				top: position.y - 30,
				left: position.x - 30,
				backgroundColor: color,
				borderBottom: "3px solid",
			}}
		>
			{label}
		</div>
	);
}
