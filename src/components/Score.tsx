import { useEffect, useState } from "react";
import { TFloor } from "../types/floor";

type TScoreCardProps = {
	score: TFloor;
	shouldFadeOut: boolean;
};

const ScoreCard = ({ score, shouldFadeOut }: TScoreCardProps) => {
	return (
		<div
			className={`score-card ${shouldFadeOut ? "fade-out" : ""}`}
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
	const [scoresToShow, setScoresToShow] = useState<TFloor[]>(scores);
	useEffect(() => {
		if (scores.length > 0) {
			setScoresToShow((prev) => [scores[0], ...prev.slice(0, 3)]); // Keep max 4 items
		}
	}, [scores]);

	return (
		<div className={`score-stack ${scores.length ? "new-item" : ""}`}>
			{scoresToShow.map((data, index) => (
				<ScoreCard key={data.id} score={data} shouldFadeOut={index === 3} />
			))}
		</div>
	);
};
