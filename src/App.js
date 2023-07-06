import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const Modal = ({ onClose, jokes, currentJokeIndex, onNextJoke }) => {
  const handleNextJoke = () => {
    onNextJoke();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Chuck Norris Joke</h2>
        {jokes.length > 0 ? (
          <>
            <p>{jokes[currentJokeIndex]}</p>
            <button onClick={handleNextJoke}>Next Joke</button>
          </>
        ) : (
          <p>No jokes available</p>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [jokes, setJokes] = useState([]);
  const [currentJokeIndex, setCurrentJokeIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://api.chucknorris.io/jokes/categories');
      const allCategories = response.data;
      const additionalCategories = ['animal', 'career'];
      const updatedCategories = [...allCategories, ...additionalCategories];
      setCategories(updatedCategories);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchJokes = async (category) => {
    try {
      const response = await axios.get(`https://api.chucknorris.io/jokes/random?category=${category}&count=3`);
      const jokesData = Array.isArray(response.data)
        ? response.data.map((jokeObj) => jokeObj.value)
        : [response.data.value];
      setJokes(jokesData);
      setCurrentJokeIndex(0);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setJokes([]);
    setCurrentJokeIndex(0);
  };

  const handleNextJoke = () => {
    setCurrentJokeIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex === jokes.length) {
        return 0;
      } else {
        return nextIndex;
      }
    });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchJokes(category);
  };

  return (
    <div className="App">
      <h1>Chuck Norris Categories</h1>
      <div className="categories">
        {categories.map((category, index) => (
          <p
            key={index}
            className={selectedCategory === category ? 'category selected' : 'category'}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </p>
        ))}
      </div>
      {showModal && (
        <Modal
          onClose={handleCloseModal}
          jokes={jokes}
          currentJokeIndex={currentJokeIndex}
          onNextJoke={handleNextJoke}
        />
      )}
    </div>
  );
};


export default App;
