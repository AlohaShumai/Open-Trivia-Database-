// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeForm from './components/HomeForm';
import QuestionForm from './components/QuestionForm';
import Results from './components/Results';

function App() {
  return (
    <Router>
      <div
        className="d-flex justify-content-center align-items-center min-vh-100"
        style={{
          background: 'linear-gradient(to bottom right, #fdfbfb, #ebedee)', // soft gradient
          padding: '1rem',
        }}
      >
        <div className="w-100" style={{ maxWidth: '500px' }}>
          <Routes>
            <Route path="/" element={<HomeForm />} />
            <Route path="/question" element={<QuestionForm />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
