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
  { id: 1, language: "python", title: "Print Function", description: "Fix the syntax error.", brokenCode: "pront(\"Hello\")", correctCode: "print(\"Hello\")", hint: "Check the spelling of print", points: 5 },
  { id: 2, language: "python", title: "Missing Parentheses", description: "Fix the print statement.", brokenCode: "print \"Hello World\"", correctCode: "print(\"Hello World\")", hint: "Python 3 needs parentheses around print", points: 5 },
  { id: 3, language: "python", title: "Missing Colon", description: "Fix the if statement.", brokenCode: "if 5 > 2\n    print(\"Yes\")", correctCode: "if 5 > 2:\n    print(\"Yes\")", hint: "If statements need a colon at the end", points: 5 },
  { id: 4, language: "python", title: "Missing Quotes", description: "Make this string work.", brokenCode: "name = Hello", correctCode: "name = \"Hello\"", hint: "Text must have quotes around it", points: 5 },
  { id: 5, language: "python", title: "Comparison vs Assignment", description: "Fix this if statement.", brokenCode: "if x = 5:\n    print(x)", correctCode: "if x == 5:\n    print(x)", hint: "Use == for comparing two things", points: 5 },
  { id: 6, language: "c", title: "Missing Semicolon", description: "This C program won't compile.", brokenCode: "int main() {\n    return 0\n}", correctCode: "int main() {\n    return 0;\n}", hint: "Every statement in C must end with a semicolon", points: 5 },
  { id: 7, language: "c", title: "Single Quotes", description: "Fix the string quotes.", brokenCode: "printf('Hello');", correctCode: "printf(\"Hello\");", hint: "In C, strings need double quotes", points: 5 },
  { id: 8, language: "c", title: "Print Typo", description: "Fix the output command.", brokenCode: "print(\"Hello\");", correctCode: "printf(\"Hello\");", hint: "In C, the function is called printf", points: 5 },
  { id: 9, language: "python", title: "Indentation Error", description: "Fix the spacing.", brokenCode: "def my_func():\nprint(\"Hi\")", correctCode: "def my_func():\n    print(\"Hi\")", hint: "Code inside a function needs spaces (indentation) in front of it", points: 5 },
  { id: 10, language: "python", title: "Capitalization Error", description: "Fix the boolean value.", brokenCode: "is_cool = true", correctCode: "is_cool = True", hint: "In Python, True and False must start with a capital letter", points: 5 },
  { id: 11, language: "javascript", title: "Console Log", description: "Fix the spelling error.", brokenCode: "console.leg(\"Hi\");", correctCode: "console.log(\"Hi\");", hint: "It is called console.log", points: 5 },
  { id: 12, language: "javascript", title: "Variable Declaration", description: "Fix the typo in the variable keyword.", brokenCode: "vat name = \"Alex\";", correctCode: "var name = \"Alex\";", hint: "The keyword is var (or let/const)", points: 5 },
  { id: 13, language: "python", title: "Array Index", description: "How do we get the first item?", brokenCode: "arr = [1, 2, 3]\nprint(arr[1])", correctCode: "arr = [1, 2, 3]\nprint(arr[0])", hint: "In programming, we start counting from 0, not 1", points: 5 },
  { id: 14, language: "python", title: "Math Error", description: "Fix the addition symbol.", brokenCode: "total = 5 x 5", correctCode: "total = 5 * 5", hint: "In coding, multiplication uses the * symbol", points: 5 },
  { id: 15, language: "javascript", title: "String Alert", description: "Fix the popup code.", brokenCode: "alert(Hello);", correctCode: "alert(\"Hello\");", hint: "Text inside an alert needs quotes", points: 5 },
  { id: 16, language: "c", title: "Include Header", description: "Fix the typo in the include statement.", brokenCode: "#includ <stdio.h>", correctCode: "#include <stdio.h>", hint: "The keyword is include", points: 5 },
  { id: 17, language: "python", title: "While Keyword", description: "Fix the typo.", brokenCode: "whil True:\n    print(\"Hi\")", correctCode: "while True:\n    print(\"Hi\")", hint: "The loop keyword is while", points: 5 },
  { id: 18, language: "python", title: "Def Keyword", description: "Fix the function creation.", brokenCode: "function my_func():\n    pass", correctCode: "def my_func():\n    pass", hint: "In Python, we create functions using the word 'def'", points: 5 },
  { id: 19, language: "javascript", title: "Function Braces", description: "Fix the brackets.", brokenCode: "function start() [\n    console.log(\"Go\");\n]", correctCode: "function start() {\n    console.log(\"Go\");\n}", hint: "Functions in JS use curly braces { }", points: 5 },
  { id: 20, language: "javascript", title: "Comparison Typo", description: "Fix the comparison operator.", brokenCode: "if (x = 5) {}", correctCode: "if (x == 5) {}", hint: "Use == for comparison", points: 5 },
  { id: 21, language: "c", title: "Missing Ampersand", description: "Fix the scanf statement.", brokenCode: "scanf(\"%d\", age);", correctCode: "scanf(\"%d\", &age);", hint: "scanf needs the & symbol before the variable name", points: 5 },
  { id: 22, language: "c", title: "Format Specifier", description: "Fix the format specifier for integer.", brokenCode: "int num = 5;\nprintf(\"%s\", num);", correctCode: "int num = 5;\nprintf(\"%d\", num);", hint: "For integers, use %d instead of %s", points: 5 },
  { id: 23, language: "python", title: "List Append", description: "Fix the list method.", brokenCode: "my_list = []\nmy_list.add(5)", correctCode: "my_list = []\nmy_list.append(5)", hint: "In Python, the list method is called append", points: 5 },
  { id: 24, language: "python", title: "String Length", description: "Fix the function to get length.", brokenCode: "size = word.length()", correctCode: "size = len(word)", hint: "In Python, use the len() function", points: 5 },
  { id: 25, language: "javascript", title: "Array Creation", description: "Fix the brackets.", brokenCode: "let arr = (1, 2, 3);", correctCode: "let arr = [1, 2, 3];", hint: "Arrays use square brackets [ ]", points: 5 },
  { id: 26, language: "c", title: "Return Statement", description: "Fix the typo.", brokenCode: "retun 0;", correctCode: "return 0;", hint: "The keyword is return", points: 5 },
  { id: 27, language: "python", title: "For Loop Typo", description: "Fix the keyword.", brokenCode: "fir i in range(5):", correctCode: "for i in range(5):", hint: "The keyword is for", points: 5 },
  { id: 28, language: "python", title: "Return Value", description: "Fix the spelling.", brokenCode: "returnn 5", correctCode: "return 5", hint: "The keyword is return", points: 5 },
  { id: 29, language: "javascript", title: "Document Write", description: "Fix the spelling.", brokenCode: "document.rit(\"Hi\");", correctCode: "document.write(\"Hi\");", hint: "The method is write", points: 5 },
  { id: 30, language: "c", title: "Main Signature", description: "Fix the return type.", brokenCode: "int main() {\n    return \"Hello\";\n}", correctCode: "int main() {\n    return 0;\n}", hint: "Main should return an integer, usually 0", points: 5 }
];
