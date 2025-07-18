// src/components/HomeForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    difficulty: '',
  });

  const [error, setError] = useState('');

  const categories = [
    { id: 9, name: 'General Knowledge' },
    { id: 11, name: 'Film' },
    { id: 17, name: 'Science & Nature' },
    { id: 21, name: 'Sports' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.difficulty) {
      setError('All fields are required.');
      return;
    }

    setError('');
    localStorage.setItem('quizUser', JSON.stringify(formData));
    navigate('/question');
  };

  return (
    <div className="card p-4 shadow-lg w-100">
      <h1 className="mb-3 text-center">🎯 Trivia Quiz</h1>
      <p className="text-muted text-center">
        Enter your name and quiz preferences to begin.
      </p>

      <form onSubmit={handleSubmit} className="mt-3">
        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-select"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">-- Select a category --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div className="mb-3">
          <label htmlFor="difficulty" className="form-label">Difficulty</label>
          <select
            className="form-select"
            id="difficulty"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option value="">-- Select difficulty --</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {error && <p className="text-danger text-center">{error}</p>}

        <button type="submit" className="btn btn-primary w-100 mt-2">Start Quiz</button>
      </form>
    </div>
  );
};

export default HomeForm;
