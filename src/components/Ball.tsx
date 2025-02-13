import { useEffect, useState } from "react";
import { TBall } from "../types/ball";

type TBallProps = Exclude<TBall, "id">;
export default function Ball(props: TBallProps) {
	const { size, position, body } = props;
	const [ballPosition, setBallPosition] = useState(position);
	useEffect(() => {
		const loop = () => {
			setBallPosition({
				x: body!.position!.x - size / 2,
				y: body!.position!.y - size / 2,
			});
			requestAnimationFrame(loop);
		};
		loop();
	}, [body, size]);

	return (
		<div
			className="ball"
			style={{
				width: size,
				height: size,
				top: ballPosition.y,
				left: ballPosition.x,
			}}
		></div>
	);
}
