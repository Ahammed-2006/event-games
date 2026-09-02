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
    "id": 1,
    "language": "python",
    "title": "Missing Colon",
    "description": "This Python function should return the factorial of n. Fix the syntax error.",
    "brokenCode": "def factorial(n)\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)",
    "correctCode": "def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)",
    "hint": "Check the function definition line carefully.",
    "points": 100
  },
  {
    "id": 2,
    "language": "javascript",
    "title": "Wrong Comparison Operator",
    "description": "This function checks if a number is even. It always returns true. Find and fix the bug.",
    "brokenCode": "function isEven(num) {\n  if (num % 2 = 0) {\n    return true;\n  }\n  return false;\n}",
    "correctCode": "function isEven(num) {\n  if (num % 2 === 0) {\n    return true;\n  }\n  return false;\n}",
    "hint": "Assignment vs comparison — they look similar but behave very differently.",
    "points": 100
  },
  {
    "id": 3,
    "language": "c",
    "title": "Infinite Loop",
    "description": "This C program should print numbers 0 to 9. It runs forever. Fix the bug.",
    "brokenCode": "#include <stdio.h>\nint main() {\n    int i = 0;\n    while (i < 10) {\n        printf(\"%d\\n\", i);\n    }\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\nint main() {\n    int i = 0;\n    while (i < 10) {\n        printf(\"%d\\n\", i);\n        i++;\n    }\n    return 0;\n}",
    "hint": "The loop condition is checked but the variable never changes.",
    "points": 100
  },
  {
    "id": 4,
    "language": "sql",
    "title": "Wrong SQL Clause Order",
    "description": "This SQL query should get names of users with score > 100, grouped by city. Fix the clause order.",
    "brokenCode": "SELECT name, city, SUM(score)\nFROM users\nGROUP BY city\nWHERE score > 100;",
    "correctCode": "SELECT name, city, SUM(score)\nFROM users\nWHERE score > 100\nGROUP BY city;",
    "hint": "SQL clauses must appear in a specific order: FROM → WHERE → GROUP BY.",
    "points": 100
  },
  {
    "id": 5,
    "language": "python",
    "title": "Off-By-One Error",
    "description": "This function should return the last element of a list. Fix the IndexError.",
    "brokenCode": "def get_last(items):\n    return items[len(items)]",
    "correctCode": "def get_last(items):\n    return items[len(items) - 1]",
    "hint": "List indices start at 0. What index does the last element have?",
    "points": 100
  },
  {
    "id": 6,
    "language": "javascript",
    "title": "Missing Return",
    "description": "This arrow function should double a number but always returns undefined. Fix it.",
    "brokenCode": "const double = (n) => {\n  n * 2;\n}",
    "correctCode": "const double = (n) => {\n  return n * 2;\n}",
    "hint": "When using curly braces in an arrow function, you need an explicit keyword.",
    "points": 100
  },
  {
    "id": 7,
    "language": "python",
    "title": "List Comprehension Syntax",
    "description": "Fix the syntax error in this list comprehension to return squares of even numbers.",
    "brokenCode": "evens = [x**2 for x in nums if x % 2 = 0]",
    "correctCode": "evens = [x**2 for x in nums if x % 2 == 0]",
    "hint": "Assignment vs equality operator.",
    "points": 100
  },
  {
    "id": 8,
    "language": "python",
    "title": "Dictionary Key Error",
    "description": "Prevent a KeyError when accessing a missing key by returning a default value.",
    "brokenCode": "val = my_dict[\"missing_key\"]",
    "correctCode": "val = my_dict.get(\"missing_key\", None)",
    "hint": "Use a dictionary method that provides a default value.",
    "points": 100
  },
  {
    "id": 9,
    "language": "python",
    "title": "Mutable Default Argument",
    "description": "Fix the function so the list doesnt persist across calls.",
    "brokenCode": "def add_item(item, lst=[]):\n    lst.append(item)\n    return lst",
    "correctCode": "def add_item(item, lst=None):\n    if lst is None:\n        lst = []\n    lst.append(item)\n    return lst",
    "hint": "Default arguments are evaluated once when the function is defined.",
    "points": 100
  },
  {
    "id": 10,
    "language": "python",
    "title": "Tuple Modification",
    "description": "Tuples are immutable. Fix the code to update the first element by converting it appropriately.",
    "brokenCode": "my_tuple = (1, 2, 3)\nmy_tuple[0] = 5",
    "correctCode": "my_tuple = (1, 2, 3)\ntemp = list(my_tuple)\ntemp[0] = 5\nmy_tuple = tuple(temp)",
    "hint": "You cannot change a tuple directly. Convert it to a list first.",
    "points": 100
  },
  {
    "id": 11,
    "language": "python",
    "title": "Global Variable Scope",
    "description": "Fix the function so it modifies the global counter variable.",
    "brokenCode": "count = 0\ndef increment():\n    count += 1",
    "correctCode": "count = 0\ndef increment():\n    global count\n    count += 1",
    "hint": "You need to declare the variable as global before modifying it.",
    "points": 100
  },
  {
    "id": 12,
    "language": "python",
    "title": "String Concatenation Type",
    "description": "Fix the TypeError when concatenating a string and an integer.",
    "brokenCode": "age = 25\nmsg = \"I am \" + age + \" years old\"",
    "correctCode": "age = 25\nmsg = \"I am \" + str(age) + \" years old\"",
    "hint": "Python does not implicitly convert integers to strings during concatenation.",
    "points": 100
  },
  {
    "id": 13,
    "language": "python",
    "title": "Class Initialization",
    "description": "Fix the syntax of the initialization method in this class.",
    "brokenCode": "class User:\n    def _init_(self, name):\n        self.name = name",
    "correctCode": "class User:\n    def __init__(self, name):\n        self.name = name",
    "hint": "Special methods in Python require double underscores (dunder).",
    "points": 100
  },
  {
    "id": 14,
    "language": "python",
    "title": "Looping with Index",
    "description": "Fix the loop to properly unpack the index and value.",
    "brokenCode": "for i, val in [10, 20, 30]:\n    print(i, val)",
    "correctCode": "for i, val in enumerate([10, 20, 30]):\n    print(i, val)",
    "hint": "Use a built-in function that yields pairs of index and value.",
    "points": 100
  },
  {
    "id": 15,
    "language": "python",
    "title": "File Closing",
    "description": "Ensure the file is properly closed automatically.",
    "brokenCode": "f = open(\"data.txt\", \"r\")\ndata = f.read()",
    "correctCode": "with open(\"data.txt\", \"r\") as f:\n    data = f.read()",
    "hint": "Use the `with` statement for context management.",
    "points": 100
  },
  {
    "id": 16,
    "language": "python",
    "title": "Try-Except Block",
    "description": "Fix the syntax for catching an exception.",
    "brokenCode": "try:\n    1 / 0\ncatch ZeroDivisionError:\n    print(\"error\")",
    "correctCode": "try:\n    1 / 0\nexcept ZeroDivisionError:\n    print(\"error\")",
    "hint": "Python uses a different keyword than JavaScript/C++ for catching exceptions.",
    "points": 100
  },
  {
    "id": 17,
    "language": "python",
    "title": "Lambda Function",
    "description": "Fix the lambda function syntax to add two numbers.",
    "brokenCode": "add = lambda x, y: return x + y",
    "correctCode": "add = lambda x, y: x + y",
    "hint": "Lambda functions have an implicit return.",
    "points": 100
  },
  {
    "id": 18,
    "language": "python",
    "title": "Boolean Operator",
    "description": "Fix the logical operator to check if x is greater than 0 AND less than 10.",
    "brokenCode": "if x > 0 && x < 10:\n    pass",
    "correctCode": "if x > 0 and x < 10:\n    pass",
    "hint": "Python uses words for logical operators, not symbols.",
    "points": 100
  },
  {
    "id": 19,
    "language": "c",
    "title": "String Termination",
    "description": "Fix the string array to ensure it is properly null-terminated.",
    "brokenCode": "char str[3] = {'H', 'i', '!'};",
    "correctCode": "char str[4] = {'H', 'i', '!', '\\0'};",
    "hint": "C strings need an extra character at the end.",
    "points": 100
  },
  {
    "id": 20,
    "language": "c",
    "title": "Pointer Dereferencing",
    "description": "Fix the code to assign the value 5 to the memory location pointed to by p.",
    "brokenCode": "int x = 0;\nint *p = &x;\np = 5;",
    "correctCode": "int x = 0;\nint *p = &x;\n*p = 5;",
    "hint": "You need to dereference the pointer to change the value it points to.",
    "points": 100
  },
  {
    "id": 21,
    "language": "c",
    "title": "Array Bounds",
    "description": "Fix the loop so it does not access out of bounds memory.",
    "brokenCode": "int arr[5];\nfor(int i=0; i<=5; i++) {\n    arr[i] = 0;\n}",
    "correctCode": "int arr[5];\nfor(int i=0; i<5; i++) {\n    arr[i] = 0;\n}",
    "hint": "Arrays in C are 0-indexed. What is the maximum valid index?",
    "points": 100
  },
  {
    "id": 22,
    "language": "c",
    "title": "Memory Leak",
    "description": "Free the dynamically allocated memory before the function returns.",
    "brokenCode": "void process() {\n    int *data = malloc(100 * sizeof(int));\n    return;\n}",
    "correctCode": "void process() {\n    int *data = malloc(100 * sizeof(int));\n    free(data);\n    return;\n}",
    "hint": "Every malloc needs a corresponding...",
    "points": 100
  },
  {
    "id": 23,
    "language": "c",
    "title": "Scanf Address",
    "description": "Fix the scanf call to properly store the integer input.",
    "brokenCode": "int num;\nscanf(\"%d\", num);",
    "correctCode": "int num;\nscanf(\"%d\", &num);",
    "hint": "scanf requires the memory address of the variable.",
    "points": 100
  },
  {
    "id": 24,
    "language": "c",
    "title": "Division by Zero Guard",
    "description": "Fix the ternary operator to prevent division by zero, returning 0 instead.",
    "brokenCode": "int res = (y == 0) ? x / y : 0;",
    "correctCode": "int res = (y == 0) ? 0 : x / y;",
    "hint": "Check the order of the true/false results in the ternary operator.",
    "points": 100
  },
  {
    "id": 25,
    "language": "c",
    "title": "Struct Access",
    "description": "Fix the syntax to access the struct member through a pointer.",
    "brokenCode": "struct Node { int val; };\nstruct Node *n = malloc(sizeof(struct Node));\nn.val = 10;",
    "correctCode": "struct Node { int val; };\nstruct Node *n = malloc(sizeof(struct Node));\nn->val = 10;",
    "hint": "Use the arrow operator when working with struct pointers.",
    "points": 100
  },
  {
    "id": 26,
    "language": "c",
    "title": "Return Local Address",
    "description": "Fix the function so it does not return the address of a local variable.",
    "brokenCode": "int* get_val() {\n    int x = 5;\n    return &x;\n}",
    "correctCode": "int* get_val() {\n    int *x = malloc(sizeof(int));\n    *x = 5;\n    return x;\n}",
    "hint": "Local variables are destroyed when the function returns. Allocate on the heap.",
    "points": 100
  },
  {
    "id": 27,
    "language": "c",
    "title": "Switch Fallthrough",
    "description": "Fix the switch statement so it doesnt fall through to the next case.",
    "brokenCode": "switch(x) {\n    case 1: printf(\"One\");\n    case 2: printf(\"Two\");\n}",
    "correctCode": "switch(x) {\n    case 1: \n        printf(\"One\");\n        break;\n    case 2: \n        printf(\"Two\");\n        break;\n}",
    "hint": "You need a specific keyword to exit a switch case.",
    "points": 100
  },
  {
    "id": 28,
    "language": "c",
    "title": "String Copy",
    "description": "Fix the code to safely copy the string without buffer overflow.",
    "brokenCode": "char dest[5];\nstrcpy(dest, \"Hello World!\");",
    "correctCode": "char dest[5];\nstrncpy(dest, \"Hello World!\", 4);\ndest[4] = '\\0';",
    "hint": "Use the bounded version of string copy function.",
    "points": 100
  },
  {
    "id": 29,
    "language": "c",
    "title": "Double Free",
    "description": "Fix the code to prevent freeing the same memory twice.",
    "brokenCode": "int *p = malloc(sizeof(int));\nfree(p);\nfree(p);",
    "correctCode": "int *p = malloc(sizeof(int));\nfree(p);\np = NULL;",
    "hint": "Set the pointer to NULL after freeing it.",
    "points": 100
  },
  {
    "id": 30,
    "language": "c",
    "title": "Integer Division",
    "description": "Fix the code to get an accurate floating point result from division.",
    "brokenCode": "float res = 5 / 2;",
    "correctCode": "float res = 5.0 / 2.0;",
    "hint": "If both operands are integers, C performs integer division (truncating decimals).",
    "points": 100
  }
];
