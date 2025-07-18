// src/components/Results.jsx
import { useNavigate } from 'react-router-dom';

const Results = () => {
  const navigate = useNavigate();
  const resultData = JSON.parse(localStorage.getItem('quizResult'));

  if (!resultData) {
    return (
      <div className="card p-4 shadow rounded-4 w-100 text-center">
        <p className="text-danger mb-3">⚠️ No quiz result found.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          🔁 Start Over
        </button>
      </div>
    );
  }

  const { name, selectedAnswer, correctAnswer, isCorrect } = resultData;

  const handleRestart = () => {
    localStorage.removeItem('quizResult');
    localStorage.removeItem('quizUser');
    localStorage.removeItem('triviaToken');
    navigate('/');
  };

  return (
    <div className="card p-4 shadow rounded-4 w-100 text-center">
      <h2 className="mb-3">📊 Results</h2>

      <p className="mb-2">
        {isCorrect
          ? `🎉 Great job, ${name}! You answered correctly.`
          : `❌ Oops, ${name}. You answered incorrectly.`}
      </p>

      {!isCorrect && (
        <p className="text-muted">
          The correct answer was:{' '}
          <strong dangerouslySetInnerHTML={{ __html: correctAnswer }} />
        </p>
      )}

      <button className="btn btn-primary mt-4 w-100" onClick={handleRestart}>
        🔁 Try Another Question
      </button>
    </div>
  );
};

export default Results;
