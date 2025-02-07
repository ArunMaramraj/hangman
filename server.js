// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = const PORT = process.env.PORT || 3000;

let word = "";
let revealedWord = [];
let guessedLetters = [];
let category = "";

// Load a random word and its category
const loadWord = () => {
  try {
 const data = {
  "Animals": ["tiger", "elephant", "dolphin", "monkey", "buffalo"],
  "Body Parts": ["elbow", "ankle", "finger", "mouth", "thighs"],
  "Countries": ["brazil", "canada", "germany", "egypt", "france", "spain"],
  "Harry Potter characters": ["severus", "draco", "hagrid", "lupin", "neville", "slughorn", "cedric", "umbridge"],
  "Genres": ["mystery", "fantasy", "horror", "romance", "thriller"],
  "Companies": ["microsoft", "apple", "google", "amazon", "facebook", "tesla", "intel", "netflix", "ibm", "samsung"],
  "Brands": ["nike", "adidas", "puma", "reebok", "gucci", "prada", "chanel", "zara"]
};
    const categories = Object.keys(data);
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomWord = data[randomCategory][Math.floor(Math.random() * data[randomCategory].length)];

    word = randomWord.toLowerCase();
    category = randomCategory;
    revealedWord = Array(word.length).fill('_');
    guessedLetters = [];
  } catch (error) {
    console.error('Error loading words:', error);
  }
};

loadWord();

app.use(express.static('public'));
app.use(express.json());

app.get('/game-state', (req, res) => {
  res.json({
    revealedWord,
    guessedLetters,
    categoryHint: category
  });
});

app.post('/guess', (req, res) => {
  const { letter } = req.body;
  if (!letter || guessedLetters.includes(letter)) {
    return res.json({ message: "Invalid or repeated guess." });
  }

  guessedLetters.push(letter);
  let correctGuess = false;

  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      revealedWord[i] = letter;
      correctGuess = true;
    }
  }

  const message = correctGuess ? `Good guess!` : `The letter '${letter}' doesn't exist.`;
  res.json({ message });
});

app.post('/reset-game', (req, res) => {
  loadWord();
  res.json({ message: "Game has been reset!" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
