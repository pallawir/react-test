import React, { useState, useEffect } from "react";
import { QUESTIONS } from "./questions";
import "./score.css";

interface Answers {
	[key: string]: string;
}

const Questionnaire: React.FC = () => {
	const [answers, setAnswers] = useState<Answers>({});
	const [score, setScore] = useState<number>(0);
	const [totalRuns, setTotalRuns] = useState<number>(0);
	const [totalScore, setTotalScore] = useState<number>(0);
	const [averageRating, setAverageRating] = useState<number>(0);
	const [selectedAnswer, setSelectedAnswer] = useState<{ questionNumber: string, answer: string } | null>(null);

	// Load totalScore and totalRuns from localStorage on component mount
	useEffect(() => {
		const storedTotalScore = localStorage.getItem("totalScore");
		const storedTotalRuns = localStorage.getItem("totalRuns");

		if (storedTotalScore && storedTotalRuns) {
			setTotalScore(parseFloat(storedTotalScore));
			setTotalRuns(parseInt(storedTotalRuns));
		}
	}, []);

	// Update localStorage whenever totalScore or totalRuns change
	useEffect(() => {
		localStorage.setItem("totalScore", totalScore.toString());
		localStorage.setItem("totalRuns", totalRuns.toString());

		// Calculate average rating
		const avgRating = totalRuns > 0 ? totalScore / totalRuns : 0;
		setAverageRating(avgRating);
	}, [totalScore, totalRuns]);

	const handleAnswerChange = (questionNumber: string, answer: string) => {
		const newAnswers = { ...answers, [questionNumber]: answer };
		setAnswers(newAnswers);
		setSelectedAnswer({ questionNumber, answer });
	};

	const calculateScore = () => {
		const numQuestions = Object.keys(QUESTIONS).length;
		const numYesAnswers = Object.values(answers).filter(
			(answer) => answer === "Yes"
		).length;
		const newScore = (numYesAnswers / numQuestions) * 100 || 0;
		setScore(newScore);

		// Update total score and total runs
		const newTotalScore = totalScore + newScore;
		const newTotalRuns = totalRuns + 1;
		setTotalScore(newTotalScore);
		setTotalRuns(newTotalRuns);
	};

	const resetQuestions = () => {
		setAnswers({});
		setScore(0);
	};

	return (
		<div>
			<h1>Questionnaire</h1>
			{Object.keys(QUESTIONS).map((questionNumber:any) => (
				<div key={questionNumber}>
					<p>{QUESTIONS[questionNumber]}</p>
					<div>
						<button
  className={selectedAnswer?.questionNumber === questionNumber && selectedAnswer?.answer === 'Yes' ? 'selected' : ''}
  onClick={() => handleAnswerChange(questionNumber, "Yes")}
>
  Yes
</button>
<button
  className={selectedAnswer?.questionNumber === questionNumber && selectedAnswer?.answer === 'No' ? 'selected' : ''}
  onClick={() => handleAnswerChange(questionNumber, "No")}
>
  No
</button>
					</div>
				</div>
			))}
			<button onClick={calculateScore}>Calculate Score</button>
			<button onClick={resetQuestions}>Reset</button>
			<div>
				<h2>Score: {score.toFixed(2)}%</h2>
			</div>
			<div>
				<h2>Average Rating: {averageRating.toFixed(2)}%</h2>
				<p>Total runs: {totalRuns}</p>
			</div>
		</div>
	);
};

export default Questionnaire;
