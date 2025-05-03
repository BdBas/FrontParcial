const API_URL = 'https://back-parcial.vercel.app/api'; // Cambia por tu URL real si es necesario

export const getQuestions = async (category) => {
  const res = await fetch(`${API_URL}/generate-questions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category }),
  });
  if (!res.ok) throw new Error('Error al obtener preguntas');
  return await res.json();
};

export const saveResult = async (data) => {
  const res = await fetch(`${API_URL}/save-results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al guardar resultado');
  return await res.json();
}; 