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
    "title": "Missing Parentheses",
    "description": "Fix the syntax error to print the greeting.",
    "brokenCode": "greeting = \"Hello World\"\nprint greeting",
    "correctCode": "greeting = \"Hello World\"\nprint(greeting)",
    "hint": "In Python 3, print is a function and requires parentheses.",
    "points": 5
  },
  {
    "id": 2,
    "language": "python",
    "title": "Missing Colon",
    "description": "Fix the if-statement syntax error.",
    "brokenCode": "age = 18\nif age >= 18\n    print(\"Adult\")",
    "correctCode": "age = 18\nif age >= 18:\n    print(\"Adult\")",
    "hint": "Python requires a specific punctuation mark at the end of if, for, and while statements.",
    "points": 5
  },
  {
    "id": 3,
    "language": "c",
    "title": "Missing Semicolon",
    "description": "This C program won't compile. Fix the syntax error.",
    "brokenCode": "#include <stdio.h>\n\nint main() {\n    printf(\"Hello\")\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\n\nint main() {\n    printf(\"Hello\");\n    return 0;\n}",
    "hint": "Every statement inside a C function must end with a specific character.",
    "points": 5
  },
  {
    "id": 4,
    "language": "python",
    "title": "Assignment vs Comparison",
    "description": "This code should check if a number is zero, but it gives an error. Fix it.",
    "brokenCode": "num = 0\nif num = 0:\n    print(\"Zero\")",
    "correctCode": "num = 0\nif num == 0:\n    print(\"Zero\")",
    "hint": "A single '=' is for assigning values. Use '==' to compare values.",
    "points": 5
  },
  {
    "id": 5,
    "language": "c",
    "title": "Scanf Error",
    "description": "This code crashes when trying to read an integer. Fix the scanf function.",
    "brokenCode": "#include <stdio.h>\nint main() {\n    int age;\n    scanf(\"%d\", age);\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\nint main() {\n    int age;\n    scanf(\"%d\", &age);\n    return 0;\n}",
    "hint": "scanf needs the memory address of the variable. Use the '&' symbol.",
    "points": 5
  },
  {
    "id": 6,
    "language": "python",
    "title": "String and Integer",
    "description": "Fix the TypeError when combining text and numbers.",
    "brokenCode": "score = 10\nprint(\"Your score is \" + score)",
    "correctCode": "score = 10\nprint(\"Your score is \" + str(score))",
    "hint": "You cannot directly add a string and a number. Convert the number to a string first using str().",
    "points": 5
  },
  {
    "id": 7,
    "language": "python",
    "title": "Variable Case Sensitivity",
    "description": "This code says 'NameError: name is not defined'. Fix the spelling mistake.",
    "brokenCode": "PlayerName = \"Alex\"\nprint(playername)",
    "correctCode": "PlayerName = \"Alex\"\nprint(PlayerName)",
    "hint": "Variables in Python are case-sensitive. 'A' is not the same as 'a'.",
    "points": 5
  },
  {
    "id": 8,
    "language": "c",
    "title": "Wrong Quotes",
    "description": "Fix the syntax error for printing a string in C.",
    "brokenCode": "#include <stdio.h>\nint main() {\n    printf('Hello World');\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\nint main() {\n    printf(\"Hello World\");\n    return 0;\n}",
    "hint": "In C, single quotes are for single characters ('A'). Double quotes are for strings.",
    "points": 5
  },
  {
    "id": 9,
    "language": "python",
    "title": "Indentation Error",
    "description": "Fix the spacing so the print statement belongs inside the function.",
    "brokenCode": "def say_hello():\nprint(\"Hello\")\n\nsay_hello()",
    "correctCode": "def say_hello():\n    print(\"Hello\")\n\nsay_hello()",
    "hint": "Python uses blank spaces (indentation) to know which lines belong inside a function or loop.",
    "points": 5
  },
  {
    "id": 10,
    "language": "c",
    "title": "Format Specifier",
    "description": "This prints weird characters instead of the number 5. Fix the printf function.",
    "brokenCode": "#include <stdio.h>\nint main() {\n    int count = 5;\n    printf(\"%s\", count);\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\nint main() {\n    int count = 5;\n    printf(\"%d\", count);\n    return 0;\n}",
    "hint": "The '%s' format is for strings. What is the format specifier for decimal integers?",
    "points": 5
  },
  {
    "id": 11,
    "language": "python",
    "title": "Index Out of Bounds",
    "description": "This code tries to print the 3rd item in a list of 3 items, but crashes. Fix it.",
    "brokenCode": "colors = [\"Red\", \"Green\", \"Blue\"]\nprint(colors[3])",
    "correctCode": "colors = [\"Red\", \"Green\", \"Blue\"]\nprint(colors[2])",
    "hint": "Lists in Python start counting from 0, not 1.",
    "points": 5
  },
  {
    "id": 12,
    "language": "c",
    "title": "Missing Include",
    "description": "The compiler says 'printf is undeclared'. Add the missing line.",
    "brokenCode": "int main() {\n    printf(\"Welcome!\");\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\nint main() {\n    printf(\"Welcome!\");\n    return 0;\n}",
    "hint": "You need to include the Standard Input Output header file at the very top.",
    "points": 5
  },
  {
    "id": 13,
    "language": "python",
    "title": "List Method Mistake",
    "description": "This code tries to add a new item to the list. Fix the wrong method name.",
    "brokenCode": "fruits = [\"Apple\"]\nfruits.add(\"Banana\")",
    "correctCode": "fruits = [\"Apple\"]\nfruits.append(\"Banana\")",
    "hint": "In Python, the method to add an item to the end of a list is called append(), not add().",
    "points": 5
  },
  {
    "id": 14,
    "language": "c",
    "title": "Infinite Loop",
    "description": "This loop runs forever instead of 5 times. Fix the bug.",
    "brokenCode": "#include <stdio.h>\nint main() {\n    int i = 0;\n    while (i < 5) {\n        printf(\"Looping...\");\n    }\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\nint main() {\n    int i = 0;\n    while (i < 5) {\n        printf(\"Looping...\");\n        i++;\n    }\n    return 0;\n}",
    "hint": "You need to increase the value of 'i' inside the loop so it eventually reaches 5.",
    "points": 5
  },
  {
    "id": 15,
    "language": "python",
    "title": "Missing Quotes",
    "description": "Fix the NameError caused by missing string quotes.",
    "brokenCode": "message = Hello World\nprint(message)",
    "correctCode": "message = \"Hello World\"\nprint(message)",
    "hint": "Text must always be surrounded by quotes, otherwise Python thinks it is a variable name.",
    "points": 5
  },
  {
    "id": 16,
    "language": "c",
    "title": "Return Type",
    "description": "The main function is supposed to return an integer. Fix the declaration.",
    "brokenCode": "#include <stdio.h>\nvoid main() {\n    printf(\"Done\");\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\nint main() {\n    printf(\"Done\");\n    return 0;\n}",
    "hint": "Change 'void' to the correct return type for the main function.",
    "points": 5
  },
  {
    "id": 17,
    "language": "python",
    "title": "Math Error",
    "description": "Calculate the area of a square correctly. Currently it calculates perimeter.",
    "brokenCode": "side = 4\narea = side * 4\nprint(area)",
    "correctCode": "side = 4\narea = side * side\nprint(area)",
    "hint": "The area of a square is length multiplied by width (side * side), not side * 4.",
    "points": 5
  },
  {
    "id": 18,
    "language": "c",
    "title": "Missing Braces",
    "description": "Fix the loop so both print statements run 3 times.",
    "brokenCode": "#include <stdio.h>\nint main() {\n    for(int i=0; i<3; i++)\n        printf(\"Line 1 \");\n        printf(\"Line 2 \");\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\nint main() {\n    for(int i=0; i<3; i++) {\n        printf(\"Line 1 \");\n        printf(\"Line 2 \");\n    }\n    return 0;\n}",
    "hint": "Without curly braces {}, a loop only executes the very next line.",
    "points": 5
  },
  {
    "id": 19,
    "language": "python",
    "title": "For Loop Range",
    "description": "Fix the for loop to repeat 5 times.",
    "brokenCode": "for i in 5:\n    print(i)",
    "correctCode": "for i in range(5):\n    print(i)",
    "hint": "You cannot loop over a plain integer. You must use the range() function.",
    "points": 5
  },
  {
    "id": 20,
    "language": "c",
    "title": "Comments Syntax",
    "description": "Fix the invalid comment that is causing a compilation error.",
    "brokenCode": "#include <stdio.h>\nint main() {\n    # This is a comment\n    printf(\"Code\");\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\nint main() {\n    // This is a comment\n    printf(\"Code\");\n    return 0;\n}",
    "hint": "C uses '//' for single-line comments, not the hashtag symbol.",
    "points": 5
  },
  {
    "id": 21,
    "language": "python",
    "title": "Missing Return",
    "description": "This function is supposed to output the sum, but prints 'None'. Fix it.",
    "brokenCode": "def add(a, b):\n    result = a + b\n\nx = add(5, 5)\nprint(x)",
    "correctCode": "def add(a, b):\n    result = a + b\n    return result\n\nx = add(5, 5)\nprint(x)",
    "hint": "Functions need the 'return' keyword to send data back to where they were called.",
    "points": 5
  },
  {
    "id": 22,
    "language": "c",
    "title": "Integer Division",
    "description": "This code prints 0 instead of 0.5. Fix it to get a decimal result.",
    "brokenCode": "#include <stdio.h>\nint main() {\n    float answer = 1 / 2;\n    printf(\"%f\", answer);\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\nint main() {\n    float answer = 1.0 / 2.0;\n    printf(\"%f\", answer);\n    return 0;\n}",
    "hint": "In C, dividing two whole numbers always drops the decimal. Make at least one number a float like 1.0.",
    "points": 5
  },
  {
    "id": 23,
    "language": "python",
    "title": "Spelling Keyword",
    "description": "Fix the typo in the Python loop keyword.",
    "brokenCode": "whil True:\n    print(\"Infinite\")",
    "correctCode": "while True:\n    print(\"Infinite\")",
    "hint": "The word for a continuous loop is 'while'.",
    "points": 5
  },
  {
    "id": 24,
    "language": "c",
    "title": "Array Declaration",
    "description": "Fix the syntax for creating an array of 5 integers.",
    "brokenCode": "int numbers(5);",
    "correctCode": "int numbers[5];",
    "hint": "In C, you use square brackets [] for arrays, not parentheses ().",
    "points": 5
  },
  {
    "id": 25,
    "language": "python",
    "title": "Function Call",
    "description": "The function is defined but never runs. Fix the code to execute it.",
    "brokenCode": "def start():\n    print(\"Started\")\n\nstart",
    "correctCode": "def start():\n    print(\"Started\")\n\nstart()",
    "hint": "To execute a function, you must put parentheses () after its name.",
    "points": 5
  },
  {
    "id": 26,
    "language": "c",
    "title": "Logical AND",
    "description": "Fix the logical operator to check if x is greater than 0 AND less than 10.",
    "brokenCode": "#include <stdio.h>\nint main() {\n    int x = 5;\n    if (x > 0 and x < 10) {\n        printf(\"Valid\");\n    }\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\nint main() {\n    int x = 5;\n    if (x > 0 && x < 10) {\n        printf(\"Valid\");\n    }\n    return 0;\n}",
    "hint": "In C, the logical AND operator is written as '&&'.",
    "points": 5
  },
  {
    "id": 27,
    "language": "python",
    "title": "Finding Length",
    "description": "Fix the code to correctly find the number of characters in the string.",
    "brokenCode": "word = \"Apple\"\nsize = word.length()\nprint(size)",
    "correctCode": "word = \"Apple\"\nsize = len(word)\nprint(size)",
    "hint": "Python uses a built-in function called len() to find the length of objects.",
    "points": 5
  },
  {
    "id": 28,
    "language": "c",
    "title": "Main Function Structure",
    "description": "Fix the structural brackets of the main function.",
    "brokenCode": "#include <stdio.h>\nint main() [\n    printf(\"Hello\");\n    return 0;\n]",
    "correctCode": "#include <stdio.h>\nint main() {\n    printf(\"Hello\");\n    return 0;\n}",
    "hint": "Code blocks in C must be enclosed in curly braces { }.",
    "points": 5
  },
  {
    "id": 29,
    "language": "python",
    "title": "Boolean Capitalization",
    "description": "Fix the syntax error caused by improper boolean capitalization.",
    "brokenCode": "is_active = true\nif is_active:\n    print(\"Active\")",
    "correctCode": "is_active = True\nif is_active:\n    print(\"Active\")",
    "hint": "In Python, the boolean values True and False must start with a capital letter.",
    "points": 5
  },
  {
    "id": 30,
    "language": "c",
    "title": "Newline Character",
    "description": "Fix the code so that each word prints on a new line.",
    "brokenCode": "#include <stdio.h>\nint main() {\n    printf(\"Hello/nWorld\");\n    return 0;\n}",
    "correctCode": "#include <stdio.h>\nint main() {\n    printf(\"Hello\\nWorld\");\n    return 0;\n}",
    "hint": "The escape character for a new line is a BACKslash '\\', not a forward slash '/'.",
    "points": 5
  }
];
