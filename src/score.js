import React, { useState, useEffect } from 'react';

const QUESTIONS = {
  1: "Can you code in Ruby?",
  2: "Can you code in JavaScript?",
  3: "Can you code in Swift?",
  4: "Can you code in Java?",
  5: "Can you code in C#"
};

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [totalRuns, setTotalRuns] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // Load totalScore and totalRuns from localStorage on component mount
  useEffect(() => {
    const storedTotalScore = localStorage.getItem('totalScore');
    const storedTotalRuns = localStorage.getItem('totalRuns');

    if (storedTotalScore && storedTotalRuns) {
      setTotalScore(parseFloat(storedTotalScore));
      setTotalRuns(parseInt(storedTotalRuns));
    }
  }, []);

  // Update localStorage whenever totalScore or totalRuns change
  useEffect(() => {
    localStorage.setItem('totalScore', totalScore.toString());
    localStorage.setItem('totalRuns', totalRuns.toString());

    // Calculate average rating
    const avgRating = totalRuns > 0 ? totalScore / totalRuns : 0;
    setAverageRating(avgRating);
  }, [totalScore, totalRuns]);

  const handleAnswerChange = (questionNumber, answer) => {
    const newAnswers = { ...answers, [questionNumber]: answer };
    setAnswers(newAnswers);
  };

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

  const resetQuestions = () => {
    setAnswers({});
    setScore(0);
  };

  return (
    <div>
      <h1>Questionnaire</h1>
      {Object.keys(QUESTIONS).map((questionNumber) => (
        <div key={questionNumber}>
          <p>{QUESTIONS[questionNumber]}</p>
          <div>
            <button onClick={() => handleAnswerChange(questionNumber, 'Yes')}>Yes</button>
            <button onClick={() => handleAnswerChange(questionNumber, 'No')}>No</button>
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
