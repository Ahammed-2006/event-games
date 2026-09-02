const fs = require('fs');

const pythonQuestions = [
  { title: 'List Comprehension Syntax', desc: 'Fix the syntax error in this list comprehension to return squares of even numbers.', b: 'evens = [x**2 for x in nums if x % 2 = 0]', c: 'evens = [x**2 for x in nums if x % 2 == 0]', hint: 'Assignment vs equality operator.' },
  { title: 'Dictionary Key Error', desc: 'Prevent a KeyError when accessing a missing key by returning a default value.', b: 'val = my_dict["missing_key"]', c: 'val = my_dict.get("missing_key", None)', hint: 'Use a dictionary method that provides a default value.' },
  { title: 'Mutable Default Argument', desc: 'Fix the function so the list doesnt persist across calls.', b: 'def add_item(item, lst=[]):\n    lst.append(item)\n    return lst', c: 'def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst', hint: 'Default arguments are evaluated once when the function is defined.' },
  { title: 'Tuple Modification', desc: 'Tuples are immutable. Fix the code to update the first element by converting it appropriately.', b: 'my_tuple = (1, 2, 3)\nmy_tuple[0] = 5', c: 'my_tuple = (1, 2, 3)\ntemp = list(my_tuple)\ntemp[0] = 5\nmy_tuple = tuple(temp)', hint: 'You cannot change a tuple directly. Convert it to a list first.' },
  { title: 'Global Variable Scope', desc: 'Fix the function so it modifies the global counter variable.', b: 'count = 0\ndef increment():\n    count += 1', c: 'count = 0\ndef increment():\n    global count\n    count += 1', hint: 'You need to declare the variable as global before modifying it.' },
  { title: 'String Concatenation Type', desc: 'Fix the TypeError when concatenating a string and an integer.', b: 'age = 25\nmsg = "I am " + age + " years old"', c: 'age = 25\nmsg = "I am " + str(age) + " years old"', hint: 'Python does not implicitly convert integers to strings during concatenation.' },
  { title: 'Class Initialization', desc: 'Fix the syntax of the initialization method in this class.', b: 'class User:\n    def _init_(self, name):\n        self.name = name', c: 'class User:\n    def __init__(self, name):\n        self.name = name', hint: 'Special methods in Python require double underscores (dunder).' },
  { title: 'Looping with Index', desc: 'Fix the loop to properly unpack the index and value.', b: 'for i, val in [10, 20, 30]:\n    print(i, val)', c: 'for i, val in enumerate([10, 20, 30]):\n    print(i, val)', hint: 'Use a built-in function that yields pairs of index and value.' },
  { title: 'File Closing', desc: 'Ensure the file is properly closed automatically.', b: 'f = open("data.txt", "r")\ndata = f.read()', c: 'with open("data.txt", "r") as f:\n    data = f.read()', hint: 'Use the `with` statement for context management.' },
  { title: 'Try-Except Block', desc: 'Fix the syntax for catching an exception.', b: 'try:\n    1 / 0\ncatch ZeroDivisionError:\n    print("error")', c: 'try:\n    1 / 0\nexcept ZeroDivisionError:\n    print("error")', hint: 'Python uses a different keyword than JavaScript/C++ for catching exceptions.' },
  { title: 'Lambda Function', desc: 'Fix the lambda function syntax to add two numbers.', b: 'add = lambda x, y: return x + y', c: 'add = lambda x, y: x + y', hint: 'Lambda functions have an implicit return.' },
  { title: 'Boolean Operator', desc: 'Fix the logical operator to check if x is greater than 0 AND less than 10.', b: 'if x > 0 && x < 10:\n    pass', c: 'if x > 0 and x < 10:\n    pass', hint: 'Python uses words for logical operators, not symbols.' }
];

const cQuestions = [
  { title: 'String Termination', desc: 'Fix the string array to ensure it is properly null-terminated.', b: 'char str[3] = {\'H\', \'i\', \'!\'};', c: 'char str[4] = {\'H\', \'i\', \'!\', \'\\0\'};', hint: 'C strings need an extra character at the end.' },
  { title: 'Pointer Dereferencing', desc: 'Fix the code to assign the value 5 to the memory location pointed to by p.', b: 'int x = 0;\nint *p = &x;\np = 5;', c: 'int x = 0;\nint *p = &x;\n*p = 5;', hint: 'You need to dereference the pointer to change the value it points to.' },
  { title: 'Array Bounds', desc: 'Fix the loop so it does not access out of bounds memory.', b: 'int arr[5];\nfor(int i=0; i<=5; i++) {\n    arr[i] = 0;\n}', c: 'int arr[5];\nfor(int i=0; i<5; i++) {\n    arr[i] = 0;\n}', hint: 'Arrays in C are 0-indexed. What is the maximum valid index?' },
  { title: 'Memory Leak', desc: 'Free the dynamically allocated memory before the function returns.', b: 'void process() {\n    int *data = malloc(100 * sizeof(int));\n    return;\n}', c: 'void process() {\n    int *data = malloc(100 * sizeof(int));\n    free(data);\n    return;\n}', hint: 'Every malloc needs a corresponding...' },
  { title: 'Scanf Address', desc: 'Fix the scanf call to properly store the integer input.', b: 'int num;\nscanf("%d", num);', c: 'int num;\nscanf("%d", &num);', hint: 'scanf requires the memory address of the variable.' },
  { title: 'Division by Zero Guard', desc: 'Fix the ternary operator to prevent division by zero, returning 0 instead.', b: 'int res = (y == 0) ? x / y : 0;', c: 'int res = (y == 0) ? 0 : x / y;', hint: 'Check the order of the true/false results in the ternary operator.' },
  { title: 'Struct Access', desc: 'Fix the syntax to access the struct member through a pointer.', b: 'struct Node { int val; };\nstruct Node *n = malloc(sizeof(struct Node));\nn.val = 10;', c: 'struct Node { int val; };\nstruct Node *n = malloc(sizeof(struct Node));\nn->val = 10;', hint: 'Use the arrow operator when working with struct pointers.' },
  { title: 'Return Local Address', desc: 'Fix the function so it does not return the address of a local variable.', b: 'int* get_val() {\n    int x = 5;\n    return &x;\n}', c: 'int* get_val() {\n    int *x = malloc(sizeof(int));\n    *x = 5;\n    return x;\n}', hint: 'Local variables are destroyed when the function returns. Allocate on the heap.' },
  { title: 'Switch Fallthrough', desc: 'Fix the switch statement so it doesnt fall through to the next case.', b: 'switch(x) {\n    case 1: printf("One");\n    case 2: printf("Two");\n}', c: 'switch(x) {\n    case 1: \n        printf("One");\n        break;\n    case 2: \n        printf("Two");\n        break;\n}', hint: 'You need a specific keyword to exit a switch case.' },
  { title: 'String Copy', desc: 'Fix the code to safely copy the string without buffer overflow.', b: 'char dest[5];\nstrcpy(dest, "Hello World!");', c: 'char dest[5];\nstrncpy(dest, "Hello World!", 4);\ndest[4] = \'\\0\';', hint: 'Use the bounded version of string copy function.' },
  { title: 'Double Free', desc: 'Fix the code to prevent freeing the same memory twice.', b: 'int *p = malloc(sizeof(int));\nfree(p);\nfree(p);', c: 'int *p = malloc(sizeof(int));\nfree(p);\np = NULL;', hint: 'Set the pointer to NULL after freeing it.' },
  { title: 'Integer Division', desc: 'Fix the code to get an accurate floating point result from division.', b: 'float res = 5 / 2;', c: 'float res = 5.0 / 2.0;', hint: 'If both operands are integers, C performs integer division (truncating decimals).' }
];

const orig = [
  { language: 'python', title: 'Missing Colon', desc: 'This Python function should return the factorial of n. Fix the syntax error.', b: `def factorial(n)\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)`, c: `def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)`, hint: 'Check the function definition line carefully.' },
  { language: 'javascript', title: 'Wrong Comparison Operator', desc: 'This function checks if a number is even. It always returns true. Find and fix the bug.', b: `function isEven(num) {\n  if (num % 2 = 0) {\n    return true;\n  }\n  return false;\n}`, c: `function isEven(num) {\n  if (num % 2 === 0) {\n    return true;\n  }\n  return false;\n}`, hint: 'Assignment vs comparison — they look similar but behave very differently.' },
  { language: 'c', title: 'Infinite Loop', desc: 'This C program should print numbers 0 to 9. It runs forever. Fix the bug.', b: `#include <stdio.h>\nint main() {\n    int i = 0;\n    while (i < 10) {\n        printf("%d\\n", i);\n    }\n    return 0;\n}`, c: `#include <stdio.h>\nint main() {\n    int i = 0;\n    while (i < 10) {\n        printf("%d\\n", i);\n        i++;\n    }\n    return 0;\n}`, hint: 'The loop condition is checked but the variable never changes.' },
  { language: 'sql', title: 'Wrong SQL Clause Order', desc: 'This SQL query should get names of users with score > 100, grouped by city. Fix the clause order.', b: `SELECT name, city, SUM(score)\nFROM users\nGROUP BY city\nWHERE score > 100;`, c: `SELECT name, city, SUM(score)\nFROM users\nWHERE score > 100\nGROUP BY city;`, hint: 'SQL clauses must appear in a specific order: FROM → WHERE → GROUP BY.' },
  { language: 'python', title: 'Off-By-One Error', desc: 'This function should return the last element of a list. Fix the IndexError.', b: `def get_last(items):\n    return items[len(items)]`, c: `def get_last(items):\n    return items[len(items) - 1]`, hint: 'List indices start at 0. What index does the last element have?' },
  { language: 'javascript', title: 'Missing Return', desc: 'This arrow function should double a number but always returns undefined. Fix it.', b: `const double = (n) => {\n  n * 2;\n}`, c: `const double = (n) => {\n  return n * 2;\n}`, hint: 'When using curly braces in an arrow function, you need an explicit keyword.' }
];

let id = 1;
const result = [];
orig.forEach(q => {
  result.push({
    id: id++,
    language: q.language,
    title: q.title,
    description: q.desc,
    brokenCode: q.b,
    correctCode: q.c,
    hint: q.hint,
    points: 100
  });
});

pythonQuestions.forEach(q => {
  result.push({
    id: id++,
    language: 'python',
    title: q.title,
    description: q.desc,
    brokenCode: q.b,
    correctCode: q.c,
    hint: q.hint,
    points: 100
  });
});

cQuestions.forEach(q => {
  result.push({
    id: id++,
    language: 'c',
    title: q.title,
    description: q.desc,
    brokenCode: q.b,
    correctCode: q.c,
    hint: q.hint,
    points: 100
  });
});

const content = `export interface DebugQuestion {
  id: number;
  language: string;
  title: string;
  description: string;
  brokenCode: string;
  correctCode: string;
  hint: string;
  points: number;
}

export const DEBUG_QUESTIONS: DebugQuestion[] = ${JSON.stringify(result, null, 2)};
`;

fs.writeFileSync('client/src/data/debugCodeData.ts', content);
console.log('Done writing 30 questions');
