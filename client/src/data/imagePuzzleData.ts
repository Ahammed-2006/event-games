export const IMAGE_PUZZLES = [
  {
    id: 1,
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%231e1e1e"/><text x="40" y="60" font-family="monospace" font-size="20" fill="%23569cd6">def</text><text x="85" y="60" font-family="monospace" font-size="20" fill="%23dcdcaa">calculate_total</text><text x="250" y="60" font-family="monospace" font-size="20" fill="%23d4d4d4">(items)</text><text x="60" y="100" font-family="monospace" font-size="20" fill="%239cdcfe">total</text><text x="120" y="100" font-family="monospace" font-size="20" fill="%23d4d4d4">=</text><text x="140" y="100" font-family="monospace" font-size="20" fill="%23b5cea8">0</text><text x="60" y="140" font-family="monospace" font-size="20" fill="%23c586c0">for</text><text x="105" y="140" font-family="monospace" font-size="20" fill="%239cdcfe">item</text><text x="155" y="140" font-family="monospace" font-size="20" fill="%23c586c0">in</text><text x="185" y="140" font-family="monospace" font-size="20" fill="%239cdcfe">items</text><text x="245" y="140" font-family="monospace" font-size="20" fill="%23d4d4d4">:</text><text x="80" y="180" font-family="monospace" font-size="20" fill="%239cdcfe">total</text><text x="140" y="180" font-family="monospace" font-size="20" fill="%23d4d4d4">+=</text><text x="170" y="180" font-family="monospace" font-size="20" fill="%239cdcfe">item</text><text x="60" y="220" font-family="monospace" font-size="20" fill="%23c586c0">return</text><text x="135" y="220" font-family="monospace" font-size="20" fill="%239cdcfe">total</text></svg>`,
    question: "Find the bug in this Python function.",
    options: [
      "Missing semicolon at line 3",
      "Missing colon (:) after def statement",
      "Incorrect indentation for return statement",
      "total variable is not declared"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23282c34"/><text x="40" y="80" font-family="monospace" font-size="24" fill="%23c678dd">SELECT</text><text x="130" y="80" font-family="monospace" font-size="24" fill="%23e5c07b">user_id, count(*)</text><text x="40" y="120" font-family="monospace" font-size="24" fill="%23c678dd">FROM</text><text x="100" y="120" font-family="monospace" font-size="24" fill="%2398c379">user_logins</text><text x="40" y="160" font-family="monospace" font-size="24" fill="%23c678dd">WHERE</text><text x="110" y="160" font-family="monospace" font-size="24" fill="%23e5c07b">login_date > '2023-01-01'</text><text x="40" y="200" font-family="monospace" font-size="24" fill="%23c678dd">ORDER BY</text><text x="150" y="200" font-family="monospace" font-size="24" fill="%23e5c07b">count(*) DESC;</text></svg>`,
    question: "Which part of the query is incorrect?",
    options: [
      "Cannot use count(*) in SELECT without GROUP BY",
      "WHERE clause cannot compare dates as strings",
      "ORDER BY must come before WHERE",
      "Missing semicolon after FROM clause"
    ],
    correctAnswer: 0
  },
  {
    id: 3,
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%230c0c0c"/><text x="20" y="40" font-family="monospace" font-size="18" fill="%234af626">user@server:~$</text><rect x="175" y="25" width="10" height="18" fill="%23cccccc"/></svg>`,
    question: "Which command would correctly list all running processes in Linux?",
    options: [
      "ls -l",
      "ps aux",
      "netstat -tuln",
      "df -h"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23ffffff"/><rect x="150" y="50" width="300" height="250" fill="%23f0f0f0" stroke="%23333" stroke-width="2"/><text x="250" y="80" font-family="sans-serif" font-weight="bold" font-size="20">Docker Host</text><rect x="180" y="100" width="240" height="60" fill="%232496ed"/><text x="230" y="135" font-family="sans-serif" font-size="18" fill="white">Docker Daemon</text><rect x="180" y="180" width="100" height="100" fill="%23e0e0e0"/><text x="195" y="210" font-family="sans-serif" font-size="14">Container 1</text><rect x="320" y="180" width="100" height="100" fill="%23e0e0e0"/><text x="335" y="210" font-family="sans-serif" font-size="14">Container 2</text></svg>`,
    question: "Which component is responsible for running and managing these containers?",
    options: [
      "Docker Hub",
      "Docker CLI",
      "Docker Daemon (dockerd)",
      "Docker Compose"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    image: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23ffffff"/><circle cx="150" cy="200" r="40" fill="%234caf50"/><text x="120" y="205" font-family="sans-serif" font-weight="bold" fill="white">Network A</text><circle cx="450" cy="200" r="40" fill="%232196f3"/><text x="420" y="205" font-family="sans-serif" font-weight="bold" fill="white">Network B</text><rect x="270" y="170" width="60" height="60" rx="10" fill="%23ff9800"/><text x="285" y="205" font-family="sans-serif" font-weight="bold" fill="white">???</text><line x1="190" y1="200" x2="270" y2="200" stroke="%23333" stroke-width="4"/><line x1="330" y1="200" x2="410" y2="200" stroke="%23333" stroke-width="4"/></svg>`,
    question: "Which device, shown in orange, forwards packets between different IP networks?",
    options: [
      "Switch",
      "Router",
      "Hub",
      "Modem"
    ],
    correctAnswer: 1
  }
];
