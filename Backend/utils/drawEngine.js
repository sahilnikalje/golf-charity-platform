// Generates 5 winning numbers (1-45) randomly
const generateRandomDraw = () => {
  const numbers = [];
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) numbers.push(num);
  }
  return numbers.sort((a, b) => a - b);
};

// Algorithmic draw weighted by user score frequency
const generateAlgorithmicDraw = (allScores) => {
  const frequency = {};
  allScores.forEach(score => {
    frequency[score] = (frequency[score] || 0) + 1;
  });

  const weighted = [];
  for (const [num, count] of Object.entries(frequency)) {
    for (let i = 0; i < count; i++) weighted.push(Number(num));
  }

  const selected = [];
  const pool = [...weighted];
  while (selected.length < 5 && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    const num = pool[idx];
    if (!selected.includes(num)) selected.push(num);
    pool.splice(idx, 1);
  }

  // Fill remaining with random if not enough unique
  while (selected.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!selected.includes(num)) selected.push(num);
  }

  return selected.sort((a, b) => a - b);
};

// Check how many numbers a user's scores match with winning numbers
const checkMatch = (userScores, winningNumbers) => {
  const scoreValues = userScores.map(s => s.value);
  const matches = scoreValues.filter(v => winningNumbers.includes(v));
  return matches.length;
};

module.exports = { generateRandomDraw, generateAlgorithmicDraw, checkMatch };