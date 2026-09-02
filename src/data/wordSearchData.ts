export const WORDS = [
  "DEBUG", "BUG", "ERROR", "KERNEL", "LINUX", "GIT", "DOCKER", 
  "PYTHON", "JAVA", "SCRIPT", "API", "SERVER", "CLIENT", "DATABASE", 
  "NETWORK", "ALGORITHM", "COMPILER", "RUNTIME", "MEMORY", "THREAD", 
  "PROCESS", "BINARY", "STACK", "QUEUE", "RECURSION"
];

const GRID_SIZE = 15;

export type GridPosition = { row: number; col: number };
export type WordPlacement = { word: string; start: GridPosition; end: GridPosition };

export function generateWordSearch() {
  // Select 10 random words
  const shuffledWords = [...WORDS].sort(() => 0.5 - Math.random());
  const selectedWords = shuffledWords.slice(0, 10);
  
  const grid: string[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
  const placements: WordPlacement[] = [];

  const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal down-right
    [-1, 1],  // diagonal up-right
    [0, -1],  // left
    [-1, 0],  // up
    [-1, -1], // diagonal up-left
    [1, -1]   // diagonal down-left
  ];

  function canPlaceWord(word: string, row: number, col: number, dirRow: number, dirCol: number) {
    for (let i = 0; i < word.length; i++) {
      const r = row + i * dirRow;
      const c = col + i * dirCol;
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
    }
    return true;
  }

  for (const word of selectedWords) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 100) {
      const dirIndex = Math.floor(Math.random() * directions.length);
      const [dirRow, dirCol] = directions[dirIndex];
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);

      if (canPlaceWord(word, row, col, dirRow, dirCol)) {
        for (let i = 0; i < word.length; i++) {
          grid[row + i * dirRow][col + i * dirCol] = word[i];
        }
        placements.push({
          word,
          start: { row, col },
          end: { row: row + (word.length - 1) * dirRow, col: col + (word.length - 1) * dirCol }
        });
        placed = true;
      }
      attempts++;
    }
  }

  // Fill empty spaces with random letters
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        const randomChar = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        grid[r][c] = randomChar;
      }
    }
  }

  return { grid, placements, selectedWords };
}
