import React, { useState } from "react";
import { getQuestions, saveResult } from "./services/api";

const categories = [
  "Moda",
  "Historia",
  "Ciencia",
  "Deporte",
  "Arte"
];

function App() {
  const [step, setStep] = useState("home"); // home | trivia | result
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Elegir categoría y cargar preguntas
  const handleCategory = async (cat) => {
    setLoading(true);
    setSelectedCategory(cat);
    try {
      const qs = await getQuestions(cat);
      setQuestions(qs);
      setStep("trivia");
      setCurrent(0);
      setScore(0);
      setAnswers([]);
    } catch (e) {
      alert("Error al obtener preguntas");
    }
    setLoading(false);
  };

  // Responder pregunta
  const handleAnswer = (isCorrect, answerText) => {
    setAnswers([...answers, { 
      question: questions[current].question, 
      answer: answerText, 
      correct: isCorrect 
    }]);
    if (isCorrect) setScore(score + 1);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  // Finalizar trivia
  const handleFinish = async () => {
    setStep("result");
    // Guardar resultado en backend
    await saveResult({
      category: selectedCategory,
      questions: questions.map((q, i) => ({
        question: q.question,
        options: q.options,
        userAnswer: answers[i]?.answer,
        correct: answers[i]?.correct
      })),
      score,
      date: new Date().toISOString()
    });
  };

  // Volver al inicio
  const handleRestart = () => {
    setStep("home");
    setSelectedCategory(null);
    setQuestions([]);
    setCurrent(0);
    setScore(0);
    setAnswers([]);
  };

  // Render
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;

  if (step === "home") {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Elige una categoría</h1>
        {categories.map((cat) => (
          <button
            key={cat}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-xl hover:bg-blue-700 transition"
            onClick={() => handleCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  }

  if (step === "trivia") {
    const q = questions[current];
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-2xl font-bold mb-4">{selectedCategory}</h2>
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
          <div className="mb-4 font-semibold">{q.question}</div>
          <div className="flex flex-col gap-2">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                className="bg-gray-200 hover:bg-green-300 px-4 py-2 rounded"
                onClick={() => handleAnswer(opt.isCorrect, opt.text)}
                disabled={answers.length > current}
              >
                {opt.text}
              </button>
            ))}
          </div>
          <div className="mt-6 text-right">
            <span>Pregunta {current + 1} de {questions.length}</span>
          </div>
          {answers.length > current && (
            <button
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded"
              onClick={() => {
                if (current < questions.length - 1) setCurrent(current + 1);
              }}
            >
              Siguiente
            </button>
          )}
          {current === questions.length - 1 && answers.length === questions.length && (
            <button
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
              onClick={handleFinish}
            >
              Finalizar trivia
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === "result") {
    const percent = (score / questions.length) * 100;
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">¡Resultados!</h2>
          <p className="mb-2">Puntaje: <b>{score}</b> de {questions.length}</p>
          <p className="mb-2">Porcentaje: <b>{percent.toFixed(1)}%</b></p>
          <button
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded"
            onClick={handleRestart}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default App;