import { useEffect, useState } from "react";
import { TFloor } from "../types/floor";

type TScoreCardProps = {
	score: TFloor;
	index: number;
};

const ScoreCard = ({ score, index }: TScoreCardProps) => {
	const [isVisible, setIsVisible] = useState<boolean>(false);

	useEffect(() => {
		setIsVisible(true);
		const timer = setTimeout(() => setIsVisible(false), 300);
		return () => clearTimeout(timer);
	}, [index]);

	return (
		<div
			className={`score-card ${isVisible ? "score-card-slide" : ""}`}
			style={{ backgroundColor: score.color }}
		>
			{score.label}
		</div>
	);
};

type TScoreProps = {
	scores: TFloor[];
};

export const Score = ({ scores }: TScoreProps) => {
	return (
		<div className="score-stack">
			{scores.map((score, index) => (
				<ScoreCard key={score.id} score={score} index={index} />
			))}
		</div>
	);
};
