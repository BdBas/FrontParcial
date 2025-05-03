const API_URL = 'https://back-parcial.vercel.app/api';

export const generateQuestions = async (category) => {
  try {
    const response = await fetch(`${API_URL}/generate-questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category }),
    });

    if (!response.ok) {
      throw new Error('Error al generar preguntas');
    }

    const questions = await response.json();
    return questions;
  } catch (error) {
    console.error('Error al generar preguntas:', error);
    throw error;
  }
};

export const saveTriviaResult = async (category, questions, score) => {
  try {
    const response = await fetch(`${API_URL}/save-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category, questions, score }),
    });

    if (!response.ok) {
      throw new Error('Error al guardar resultados');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al guardar resultados:', error);
    throw error;
  }
}; 