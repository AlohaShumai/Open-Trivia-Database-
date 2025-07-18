import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuestionForm = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem('quizUser');
    return stored ? JSON.parse(stored) : null;
  });

  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData) {
      setApiError('User data is missing. Please go back and fill out the form.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const getToken = async () => {
      let token = localStorage.getItem('triviaToken');
      if (!token) {
        const res = await fetch('https://opentdb.com/api_token.php?command=request');
        const data = await res.json();
        token = data.token;
        localStorage.setItem('triviaToken', token);
      }
      return token;
    };

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        const url = `https://opentdb.com/api.php?amount=1&category=${userData.category}&difficulty=${userData.difficulty}&type=multiple&token=${token}`;
        console.log('Fetching:', url);

        const res = await fetch(url);

        if (res.status === 429) {
          throw new Error("You've made too many requests. Please wait and try again.");
        }

        const data = await res.json();

        if (data.response_code === 3 || data.response_code === 4) {
          localStorage.removeItem('triviaToken');
          return fetchQuestion(); // retry
        }

        if (data.response_code !== 0 || !data.results[0]) {
          throw new Error("No question found. Try different settings.");
        }

        const q = data.results[0];
        const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

        if (isMounted) {
          setQuestionData({
            question: q.question,
            correct: q.correct_answer,
            answers,
          });
          setApiError('');
        }
      } catch (err) {
        if (isMounted) setApiError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchQuestion();

    return () => {
      isMounted = false;
    };
  }, [userData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedAnswer) {
      setError('Please choose an answer.');
      return;
    }

    const isCorrect = selectedAnswer === questionData.correct;

    localStorage.setItem('quizResult', JSON.stringify({
      name: userData.name,
      correctAnswer: questionData.correct,
      selectedAnswer,
      isCorrect,
    }));

    navigate('/results');
  };

  if (loading) return <p className="text-center">Loading your question...</p>;

  if (apiError) {
    return (
      <div className="text-danger text-center">
        <p>⚠️ {apiError}</p>
        <button className="btn btn-secondary mt-3" onClick={() => navigate('/')}>
          🔁 Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="card p-4 shadow rounded-4 w-100">
      <h2 className="mb-3 text-center">🧠 Quiz Time!</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div dangerouslySetInnerHTML={{ __html: questionData.question }} className="fw-bold" />
        </div>

        {questionData.answers.map((answer, index) => (
          <div className="form-check" key={index}>
            <input
              className="form-check-input"
              type="radio"
              name="answer"
              id={`answer-${index}`}
              value={answer}
              checked={selectedAnswer === answer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
            <label
              className="form-check-label"
              htmlFor={`answer-${index}`}
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </div>
        ))}

        {error && <p className="text-danger mt-2 text-center">{error}</p>}

        <button type="submit" className="btn btn-success mt-3 w-100">
          Submit Answer
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;
