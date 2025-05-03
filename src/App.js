import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { generateQuestions } from './services/openai';

const categories = [
  { id: 1, name: 'Moda', color: '#FF6B6B' },
  { id: 2, name: 'Historia', color: '#4ECDC4' },
  { id: 3, name: 'Ciencia', color: '#45B7D1' },
  { id: 4, name: 'Deporte', color: '#96CEB4' },
  { id: 5, name: 'Arte', color: '#FFEEAD' }
];

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCategorySelect = async (category) => {
    setLoading(true);
    try {
      const generatedQuestions = await generateQuestions(category);
      setQuestions(generatedQuestions);
      setSelectedCategory(category);
    } catch (error) {
      console.error('Error al cargar preguntas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleFinish = () => {
    setSelectedCategory(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </SafeAreaView>
    );
  }

  if (!selectedCategory) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Selecciona una categoría</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryButton, { backgroundColor: category.color }]}
              onPress={() => handleCategorySelect(category.name)}
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Resultados</Text>
        <View style={styles.resultsContainer}>
          <Text style={styles.resultText}>
            Puntuación: {score}/{questions.length}
          </Text>
          <Text style={styles.resultText}>
            Porcentaje: {percentage.toFixed(1)}%
          </Text>
          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Finalizar trivia</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{selectedCategory}</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {questions[currentQuestion]?.question}
        </Text>
        <View style={styles.optionsContainer}>
          {questions[currentQuestion]?.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(option.isCorrect)}
            >
              <Text style={styles.optionText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  categoriesContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  categoryButton: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  categoryText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 15,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  finishButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
  },
});

export default App; 