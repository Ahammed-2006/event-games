export interface DebugQuestion {
  id: number;
  language: string;
  title: string;
  description: string;
  brokenCode: string;
  correctCode: string;
  hint: string;
  points: number;
}

export const DEBUG_QUESTIONS: DebugQuestion[] = [
  {
    id: 1,
    language: 'python',
    title: 'Missing Colon',
    description: 'This Python function should return the factorial of n. Fix the syntax error.',
    brokenCode: `def factorial(n)
    if n == 0:
        return 1
    return n * factorial(n - 1)`,
    correctCode: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)`,
    hint: 'Check the function definition line carefully.',
    points: 100,
  },
  {
    id: 2,
    language: 'javascript',
    title: 'Wrong Comparison Operator',
    description: 'This function checks if a number is even. It always returns true. Find and fix the bug.',
    brokenCode: `function isEven(num) {
  if (num % 2 = 0) {
    return true;
  }
  return false;
}`,
    correctCode: `function isEven(num) {
  if (num % 2 === 0) {
    return true;
  }
  return false;
}`,
    hint: 'Assignment vs comparison — they look similar but behave very differently.',
    points: 100,
  },
  {
    id: 3,
    language: 'c',
    title: 'Infinite Loop',
    description: 'This C program should print numbers 0 to 9. It runs forever. Fix the bug.',
    brokenCode: `#include <stdio.h>
int main() {
    int i = 0;
    while (i < 10) {
        printf("%d\\n", i);
    }
    return 0;
}`,
    correctCode: `#include <stdio.h>
int main() {
    int i = 0;
    while (i < 10) {
        printf("%d\\n", i);
        i++;
    }
    return 0;
}`,
    hint: 'The loop condition is checked but the variable never changes.',
    points: 100,
  },
  {
    id: 4,
    language: 'sql',
    title: 'Wrong SQL Clause Order',
    description: 'This SQL query should get names of users with score > 100, grouped by city. Fix the clause order.',
    brokenCode: `SELECT name, city, SUM(score)
FROM users
GROUP BY city
WHERE score > 100;`,
    correctCode: `SELECT name, city, SUM(score)
FROM users
WHERE score > 100
GROUP BY city;`,
    hint: 'SQL clauses must appear in a specific order: FROM → WHERE → GROUP BY.',
    points: 100,
  },
  {
    id: 5,
    language: 'python',
    title: 'Off-By-One Error',
    description: 'This function should return the last element of a list. Fix the IndexError.',
    brokenCode: `def get_last(items):
    return items[len(items)]`,
    correctCode: `def get_last(items):
    return items[len(items) - 1]`,
    hint: 'List indices start at 0. What index does the last element have?',
    points: 100,
  },
  {
    id: 6,
    language: 'javascript',
    title: 'Missing Return',
    description: 'This arrow function should double a number but always returns undefined. Fix it.',
    brokenCode: `const double = (n) => {
  n * 2;
}`,
    correctCode: `const double = (n) => {
  return n * 2;
}`,
    hint: 'When using curly braces in an arrow function, you need an explicit keyword.',
    points: 100,
  },
];
