import React, { useState, useEffect } from 'react';
import { QUESTIONS } from './questions';

// Define types
type Answer = 'Yes' | 'No';
type QuestionNumber = number;

const Questionnaire: React.FC = () => {
  const [answers, setAnswers] = useState<Record<QuestionNumber, Answer | undefined>>({});
  const [score, setScore] = useState<number>(0);
  const [totalRuns, setTotalRuns] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);

  // Load totalScore and totalRuns from the backend on component mount
  useEffect(() => {
    fetch('http://localhost:3001/stats')
      .then(response => response.json())
      .then(data => {
        setTotalScore(data.totalScore);
        setTotalRuns(data.totalRuns);
      })
      .catch(error => console.error('Error fetching stats:', error));
  }, []);

  // Update backend whenever totalScore or totalRuns change
  useEffect(() => {
    // Update backend whenever totalScore or totalRuns change
    if (totalScore !== 0 || totalRuns !== 0) {
      fetch('http://localhost:3001/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalScore, totalRuns }),
      })
        .then(response => response.json())
        .then(data => {
          const avgRating = data.totalRuns > 0 ? data.totalScore / data.totalRuns : 0;
          setAverageRating(avgRating);
        })
        .catch(error => console.error('Error updating stats:', error));
    }
  }, [totalScore, totalRuns]);
  // Handle answer change
  const handleAnswerChange = (questionNumber: QuestionNumber, answer: Answer) => {
    setAnswers(prevAnswers => ({ ...prevAnswers, [questionNumber]: answer }));
  };

  // Calculate the score based on answers
  const calculateScore = () => {
    const numQuestions = Object.keys(QUESTIONS).length;
    const numYesAnswers = Object.values(answers).filter(answer => answer === 'Yes').length;
    const newScore = (numYesAnswers / numQuestions) * 100 || 0;
    setScore(newScore);

    // Update total score and total runs
    const newTotalScore = totalScore + newScore;
    const newTotalRuns = totalRuns + 1;
    setTotalScore(newTotalScore);
    setTotalRuns(newTotalRuns);
  };

  // Reset answers
  const resetQuestions = () => {
    setAnswers({});
  };

  return (
    <div>
      <h1>Questionnaire</h1>
      {Object.keys(QUESTIONS).map((questionNumberStr) => {
        const questionNumber = parseInt(questionNumberStr) as QuestionNumber;
        return (
          <div key={questionNumber}>
            <p>{QUESTIONS[questionNumber]}</p>
            <div>
              <button onClick={() => handleAnswerChange(questionNumber, 'Yes')}>Yes</button>
              <button onClick={() => handleAnswerChange(questionNumber, 'No')}>No</button>
            </div>
          </div>
        );
      })}
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
