export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  testCases: TestCase[];
  starterCode: string;
}

export const PROBLEMS: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    testCases: [
      { id: "tc1", input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
      { id: "tc2", input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
      { id: "tc3", input: "[3,3]\n6", expectedOutput: "[0,1]" },
    ],
    starterCode: `function twoSum(nums, target) {\n  // Your code here\n  \n}`,
  },
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    description:
      "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.",
    examples: [
      { input: "x = 121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." },
      { input: "x = -121", output: "false", explanation: "From left to right, it reads -121. From right to left it becomes 121-." },
    ],
    testCases: [
      { id: "tc1", input: "121", expectedOutput: "true" },
      { id: "tc2", input: "-121", expectedOutput: "false" },
      { id: "tc3", input: "10", expectedOutput: "false" },
      { id: "tc4", input: "0", expectedOutput: "true" },
    ],
    starterCode: `function isPalindrome(x) {\n  // Your code here\n  \n}`,
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description:
      'Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    testCases: [
      { id: "tc1", input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      { id: "tc2", input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' },
    ],
    starterCode: `function reverseString(s) {\n  // Your code here\n  \n}`,
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description:
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" },
    ],
    testCases: [
      { id: "tc1", input: "()", expectedOutput: "true" },
      { id: "tc2", input: "()[]{}", expectedOutput: "true" },
      { id: "tc3", input: "(]", expectedOutput: "false" },
      { id: "tc4", input: "([)]", expectedOutput: "false" },
    ],
    starterCode: `function isValid(s) {\n  // Your code here\n  \n}`,
  },
  {
    id: "fizz-buzz",
    title: "Fizz Buzz",
    difficulty: "Easy",
    description:
      'Given an integer `n`, return a string array `answer` (1-indexed) where:\n\n- `answer[i] == "FizzBuzz"` if `i` is divisible by 3 and 5.\n- `answer[i] == "Fizz"` if `i` is divisible by 3.\n- `answer[i] == "Buzz"` if `i` is divisible by 5.\n- `answer[i] == i` (as a string) if none of the above conditions are true.',
    examples: [
      { input: "n = 3", output: '["1","2","Fizz"]' },
      { input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' },
    ],
    testCases: [
      { id: "tc1", input: "3", expectedOutput: '["1","2","Fizz"]' },
      { id: "tc2", input: "5", expectedOutput: '["1","2","Fizz","4","Buzz"]' },
      { id: "tc3", input: "15", expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
    ],
    starterCode: `function fizzBuzz(n) {\n  // Your code here\n  \n}`,
  },
  {
    id: "merge-sorted-array",
    title: "Merge Sorted Array",
    difficulty: "Easy",
    description:
      "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.\n\nMerge `nums1` and `nums2` into a single array sorted in non-decreasing order.",
    examples: [
      { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
    ],
    testCases: [
      { id: "tc1", input: "[1,2,3,0,0,0]\n3\n[2,5,6]\n3", expectedOutput: "[1,2,2,3,5,6]" },
      { id: "tc2", input: "[1]\n1\n[]\n0", expectedOutput: "[1]" },
    ],
    starterCode: `function merge(nums1, m, nums2, n) {\n  // Your code here\n  \n}`,
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    description:
      "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1" },
    ],
    testCases: [
      { id: "tc1", input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
      { id: "tc2", input: "[1]", expectedOutput: "1" },
      { id: "tc3", input: "[5,4,-1,7,8]", expectedOutput: "23" },
    ],
    starterCode: `function maxSubArray(nums) {\n  // Your code here\n  \n}`,
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    description:
      "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the ith line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
    ],
    testCases: [
      { id: "tc1", input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49" },
      { id: "tc2", input: "[1,1]", expectedOutput: "1" },
    ],
    starterCode: `function maxArea(height) {\n  // Your code here\n  \n}`,
  },
];
