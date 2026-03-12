export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
}

export interface StarterCode {
  javascript: string;
  python: string;
  cpp: string;
  java: string;
  typescript: string;
  go: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  testCases: TestCase[];
  starterCode: StarterCode;
}

export const LANGUAGES = [
  { id: "javascript", name: "JavaScript", pistonLang: "javascript", pistonVersion: "18.15.0" },
  { id: "python", name: "Python 3", pistonLang: "python", pistonVersion: "3.10.0" },
  { id: "typescript", name: "TypeScript", pistonLang: "typescript", pistonVersion: "5.0.3" },
  { id: "cpp", name: "C++", pistonLang: "c++", pistonVersion: "10.2.0" },
  { id: "java", name: "Java", pistonLang: "java", pistonVersion: "15.0.2" },
  { id: "go", name: "Go", pistonLang: "go", pistonVersion: "1.16.2" },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]["id"];

export const PROBLEMS: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    testCases: [
      { id: "tc1", input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
      { id: "tc2", input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
      { id: "tc3", input: "[3,3]\n6", expectedOutput: "[0,1]" },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Your code here\n}`,
      python: `def two_sum(nums, target):\n    # Your code here\n    pass`,
      typescript: `function twoSum(nums: number[], target: number): number[] {\n  // Your code here\n  return [];\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n        return {};\n    }\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}`,
      go: `func twoSum(nums []int, target int) []int {\n    // Your code here\n    return nil\n}`,
    },
  },
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    description: "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.",
    examples: [
      { input: "x = 121", output: "true", explanation: "121 reads as 121 from left to right and from right to left." },
      { input: "x = -121", output: "false" },
    ],
    testCases: [
      { id: "tc1", input: "121", expectedOutput: "true" },
      { id: "tc2", input: "-121", expectedOutput: "false" },
      { id: "tc3", input: "10", expectedOutput: "false" },
      { id: "tc4", input: "0", expectedOutput: "true" },
    ],
    starterCode: {
      javascript: `function isPalindrome(x) {\n  // Your code here\n}`,
      python: `def is_palindrome(x):\n    # Your code here\n    pass`,
      typescript: `function isPalindrome(x: number): boolean {\n  // Your code here\n  return false;\n}`,
      cpp: `class Solution {\npublic:\n    bool isPalindrome(int x) {\n        // Your code here\n        return false;\n    }\n};`,
      java: `class Solution {\n    public boolean isPalindrome(int x) {\n        // Your code here\n        return false;\n    }\n}`,
      go: `func isPalindrome(x int) bool {\n    // Your code here\n    return false\n}`,
    },
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
    ],
    testCases: [
      { id: "tc1", input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      { id: "tc2", input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' },
    ],
    starterCode: {
      javascript: `function reverseString(s) {\n  // Your code here\n}`,
      python: `def reverse_string(s):\n    # Your code here\n    pass`,
      typescript: `function reverseString(s: string[]): void {\n  // Your code here\n}`,
      cpp: `class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Your code here\n    }\n};`,
      java: `class Solution {\n    public void reverseString(char[] s) {\n        // Your code here\n    }\n}`,
      go: `func reverseString(s []byte) {\n    // Your code here\n}`,
    },
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
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
      { id: "tc5", input: "{[]}", expectedOutput: "true" },
    ],
    starterCode: {
      javascript: `function isValid(s) {\n  // Your code here\n}`,
      python: `def is_valid(s):\n    # Your code here\n    pass`,
      typescript: `function isValid(s: string): boolean {\n  // Your code here\n  return false;\n}`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        // Your code here\n        return false;\n    }\n};`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n}`,
      go: `func isValid(s string) bool {\n    // Your code here\n    return false\n}`,
    },
  },
  {
    id: "fizz-buzz",
    title: "Fizz Buzz",
    difficulty: "Easy",
    description: 'Given an integer `n`, return a string array `answer` (1-indexed) where:\n- `answer[i] == "FizzBuzz"` if `i` is divisible by 3 and 5.\n- `answer[i] == "Fizz"` if `i` is divisible by 3.\n- `answer[i] == "Buzz"` if `i` is divisible by 5.\n- `answer[i] == i` (as a string) if none of the above conditions are true.',
    examples: [
      { input: "n = 3", output: '["1","2","Fizz"]' },
      { input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' },
    ],
    testCases: [
      { id: "tc1", input: "3", expectedOutput: '["1","2","Fizz"]' },
      { id: "tc2", input: "5", expectedOutput: '["1","2","Fizz","4","Buzz"]' },
      { id: "tc3", input: "15", expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
    ],
    starterCode: {
      javascript: `function fizzBuzz(n) {\n  // Your code here\n}`,
      python: `def fizz_buzz(n):\n    # Your code here\n    pass`,
      typescript: `function fizzBuzz(n: number): string[] {\n  // Your code here\n  return [];\n}`,
      cpp: `class Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        // Your code here\n        return {};\n    }\n};`,
      java: `class Solution {\n    public List<String> fizzBuzz(int n) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
      go: `func fizzBuzz(n int) []string {\n    // Your code here\n    return nil\n}`,
    },
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    examples: [
      { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
      { input: "nums = [1]", output: "1" },
    ],
    testCases: [
      { id: "tc1", input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
      { id: "tc2", input: "[1]", expectedOutput: "1" },
      { id: "tc3", input: "[5,4,-1,7,8]", expectedOutput: "23" },
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Your code here\n}`,
      python: `def max_sub_array(nums):\n    # Your code here\n    pass`,
      typescript: `function maxSubArray(nums: number[]): number {\n  // Your code here\n  return 0;\n}`,
      cpp: `class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Your code here\n        return 0;\n    }\n};`,
      java: `class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}`,
      go: `func maxSubArray(nums []int) int {\n    // Your code here\n    return 0\n}`,
    },
  },
  {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the ith line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
    examples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49" },
    ],
    testCases: [
      { id: "tc1", input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49" },
      { id: "tc2", input: "[1,1]", expectedOutput: "1" },
    ],
    starterCode: {
      javascript: `function maxArea(height) {\n  // Your code here\n}`,
      python: `def max_area(height):\n    # Your code here\n    pass`,
      typescript: `function maxArea(height: number[]): number {\n  // Your code here\n  return 0;\n}`,
      cpp: `class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        // Your code here\n        return 0;\n    }\n};`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        // Your code here\n        return 0;\n    }\n}`,
      go: `func maxArea(height []int) int {\n    // Your code here\n    return 0\n}`,
    },
  },
  {
    id: "merge-sorted-array",
    title: "Merge Sorted Array",
    difficulty: "Easy",
    description: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`, representing the number of elements in `nums1` and `nums2` respectively.\n\nMerge `nums1` and `nums2` into a single array sorted in non-decreasing order.",
    examples: [
      { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]" },
    ],
    testCases: [
      { id: "tc1", input: "[1,2,3,0,0,0]\n3\n[2,5,6]\n3", expectedOutput: "[1,2,2,3,5,6]" },
      { id: "tc2", input: "[1]\n1\n[]\n0", expectedOutput: "[1]" },
    ],
    starterCode: {
      javascript: `function merge(nums1, m, nums2, n) {\n  // Your code here\n}`,
      python: `def merge(nums1, m, nums2, n):\n    # Your code here\n    pass`,
      typescript: `function merge(nums1: number[], m: number, nums2: number[], n: number): void {\n  // Your code here\n}`,
      cpp: `class Solution {\npublic:\n    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        // Your code here\n    }\n};`,
      java: `class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        // Your code here\n    }\n}`,
      go: `func merge(nums1 []int, m int, nums2 []int, n int) {\n    // Your code here\n}`,
    },
  },
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    examples: [
      { input: "n = 2", output: "2", explanation: "1. 1 step + 1 step\n2. 2 steps" },
      { input: "n = 3", output: "3" },
    ],
    testCases: [
      { id: "tc1", input: "2", expectedOutput: "2" },
      { id: "tc2", input: "3", expectedOutput: "3" },
      { id: "tc3", input: "5", expectedOutput: "8" },
    ],
    starterCode: {
      javascript: `function climbStairs(n) {\n  // Your code here\n}`,
      python: `def climb_stairs(n):\n    # Your code here\n    pass`,
      typescript: `function climbStairs(n: number): number {\n  // Your code here\n  return 0;\n}`,
      cpp: `class Solution {\npublic:\n    int climbStairs(int n) {\n        // Your code here\n        return 0;\n    }\n};`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        // Your code here\n        return 0;\n    }\n}`,
      go: `func climbStairs(n int) int {\n    // Your code here\n    return 0\n}`,
    },
  },
  {
    id: "best-time-to-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
    examples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
      { input: "prices = [7,6,4,3,1]", output: "0" },
    ],
    testCases: [
      { id: "tc1", input: "[7,1,5,3,6,4]", expectedOutput: "5" },
      { id: "tc2", input: "[7,6,4,3,1]", expectedOutput: "0" },
      { id: "tc3", input: "[2,4,1]", expectedOutput: "2" },
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {\n  // Your code here\n}`,
      python: `def max_profit(prices):\n    # Your code here\n    pass`,
      typescript: `function maxProfit(prices: number[]): number {\n  // Your code here\n  return 0;\n}`,
      cpp: `class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Your code here\n        return 0;\n    }\n};`,
      java: `class Solution {\n    public int maxProfit(int[] prices) {\n        // Your code here\n        return 0;\n    }\n}`,
      go: `func maxProfit(prices []int) int {\n    // Your code here\n    return 0\n}`,
    },
  },
  {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.",
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1" },
    ],
    testCases: [
      { id: "tc1", input: "[-1,0,3,5,9,12]\n9", expectedOutput: "4" },
      { id: "tc2", input: "[-1,0,3,5,9,12]\n2", expectedOutput: "-1" },
      { id: "tc3", input: "[5]\n5", expectedOutput: "0" },
    ],
    starterCode: {
      javascript: `function search(nums, target) {\n  // Your code here\n}`,
      python: `def search(nums, target):\n    # Your code here\n    pass`,
      typescript: `function search(nums: number[], target: number): number {\n  // Your code here\n  return -1;\n}`,
      cpp: `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        // Your code here\n        return -1;\n    }\n};`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n        return -1;\n    }\n}`,
      go: `func search(nums []int, target int) int {\n    // Your code here\n    return -1\n}`,
    },
  },
  {
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    difficulty: "Easy",
    description: "Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.\n\nReturn `true` if there is a cycle in the linked list. Otherwise, return `false`.",
    examples: [
      { input: "head = [3,2,0,-4], pos = 1", output: "true", explanation: "There is a cycle in the linked list, where the tail connects to the 1st node (0-indexed)." },
    ],
    testCases: [
      { id: "tc1", input: "[3,2,0,-4]\n1", expectedOutput: "true" },
      { id: "tc2", input: "[1,2]\n0", expectedOutput: "true" },
      { id: "tc3", input: "[1]\n-1", expectedOutput: "false" },
    ],
    starterCode: {
      javascript: `function hasCycle(head) {\n  // Your code here\n}`,
      python: `def has_cycle(head):\n    # Your code here\n    pass`,
      typescript: `function hasCycle(head: ListNode | null): boolean {\n  // Your code here\n  return false;\n}`,
      cpp: `class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        // Your code here\n        return false;\n    }\n};`,
      java: `public class Solution {\n    public boolean hasCycle(ListNode head) {\n        // Your code here\n        return false;\n    }\n}`,
      go: `func hasCycle(head *ListNode) bool {\n    // Your code here\n    return false\n}`,
    },
  },
  {
    id: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    description: "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" },
    ],
    testCases: [
      { id: "tc1", input: "[-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]" },
      { id: "tc2", input: "[0,1,1]", expectedOutput: "[]" },
      { id: "tc3", input: "[0,0,0]", expectedOutput: "[[0,0,0]]" },
    ],
    starterCode: {
      javascript: `function threeSum(nums) {\n  // Your code here\n}`,
      python: `def three_sum(nums):\n    # Your code here\n    pass`,
      typescript: `function threeSum(nums: number[]): number[][] {\n  // Your code here\n  return [];\n}`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        // Your code here\n        return {};\n    }\n};`,
      java: `class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
      go: `func threeSum(nums []int) [][]int {\n    // Your code here\n    return nil\n}`,
    },
  },
  {
    id: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    description: "Given a string `s`, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: "1" },
    ],
    testCases: [
      { id: "tc1", input: "abcabcbb", expectedOutput: "3" },
      { id: "tc2", input: "bbbbb", expectedOutput: "1" },
      { id: "tc3", input: "pwwkew", expectedOutput: "3" },
      { id: "tc4", input: "", expectedOutput: "0" },
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // Your code here\n}`,
      python: `def length_of_longest_substring(s):\n    # Your code here\n    pass`,
      typescript: `function lengthOfLongestSubstring(s: string): number {\n  // Your code here\n  return 0;\n}`,
      cpp: `class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        // Your code here\n        return 0;\n    }\n};`,
      java: `class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n        return 0;\n    }\n}`,
      go: `func lengthOfLongestSubstring(s string) int {\n    // Your code here\n    return 0\n}`,
    },
  },
  {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nYou must write an algorithm that runs in O(n) time and without using the division operation.",
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
    ],
    testCases: [
      { id: "tc1", input: "[1,2,3,4]", expectedOutput: "[24,12,8,6]" },
      { id: "tc2", input: "[-1,1,0,-3,3]", expectedOutput: "[0,0,9,0,0]" },
    ],
    starterCode: {
      javascript: `function productExceptSelf(nums) {\n  // Your code here\n}`,
      python: `def product_except_self(nums):\n    # Your code here\n    pass`,
      typescript: `function productExceptSelf(nums: number[]): number[] {\n  // Your code here\n  return [];\n}`,
      cpp: `class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        // Your code here\n        return {};\n    }\n};`,
      java: `class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Your code here\n        return new int[]{};\n    }\n}`,
      go: `func productExceptSelf(nums []int) []int {\n    // Your code here\n    return nil\n}`,
    },
  },
  {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
    ],
    testCases: [
      { id: "tc1", input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
      { id: "tc2", input: '[""]', expectedOutput: '[[""]]' },
      { id: "tc3", input: '["a"]', expectedOutput: '[["a"]]' },
    ],
    starterCode: {
      javascript: `function groupAnagrams(strs) {\n  // Your code here\n}`,
      python: `def group_anagrams(strs):\n    # Your code here\n    pass`,
      typescript: `function groupAnagrams(strs: string[]): string[][] {\n  // Your code here\n  return [];\n}`,
      cpp: `class Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        // Your code here\n        return {};\n    }\n};`,
      java: `class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
      go: `func groupAnagrams(strs []string) [][]string {\n    // Your code here\n    return nil\n}`,
    },
  },
  {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.\n\nYou may assume that you have an infinite number of each kind of coin.",
    examples: [
      { input: "coins = [1,5,10], amount = 12", output: "3", explanation: "12 = 10 + 1 + 1" },
      { input: "coins = [2], amount = 3", output: "-1" },
    ],
    testCases: [
      { id: "tc1", input: "[1,5,10]\n12", expectedOutput: "3" },
      { id: "tc2", input: "[2]\n3", expectedOutput: "-1" },
      { id: "tc3", input: "[1]\n0", expectedOutput: "0" },
    ],
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n  // Your code here\n}`,
      python: `def coin_change(coins, amount):\n    # Your code here\n    pass`,
      typescript: `function coinChange(coins: number[], amount: number): number {\n  // Your code here\n  return -1;\n}`,
      cpp: `class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        // Your code here\n        return -1;\n    }\n};`,
      java: `class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Your code here\n        return -1;\n    }\n}`,
      go: `func coinChange(coins []int, amount int) int {\n    // Your code here\n    return -1\n}`,
    },
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    description: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
    ],
    testCases: [
      { id: "tc1", input: "[[1,3],[2,6],[8,10],[15,18]]", expectedOutput: "[[1,6],[8,10],[15,18]]" },
      { id: "tc2", input: "[[1,4],[4,5]]", expectedOutput: "[[1,5]]" },
    ],
    starterCode: {
      javascript: `function merge(intervals) {\n  // Your code here\n}`,
      python: `def merge(intervals):\n    # Your code here\n    pass`,
      typescript: `function merge(intervals: number[][]): number[][] {\n  // Your code here\n  return [];\n}`,
      cpp: `class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        // Your code here\n        return {};\n    }\n};`,
      java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Your code here\n        return new int[][]{};\n    }\n}`,
      go: `func merge(intervals [][]int) [][]int {\n    // Your code here\n    return nil\n}`,
    },
  },
  {
    id: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    description: "Given a string `s`, return the longest palindromic substring in `s`.",
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
      { input: 's = "cbbd"', output: '"bb"' },
    ],
    testCases: [
      { id: "tc1", input: "babad", expectedOutput: "bab" },
      { id: "tc2", input: "cbbd", expectedOutput: "bb" },
      { id: "tc3", input: "a", expectedOutput: "a" },
    ],
    starterCode: {
      javascript: `function longestPalindrome(s) {\n  // Your code here\n}`,
      python: `def longest_palindrome(s):\n    # Your code here\n    pass`,
      typescript: `function longestPalindrome(s: string): string {\n  // Your code here\n  return "";\n}`,
      cpp: `class Solution {\npublic:\n    string longestPalindrome(string s) {\n        // Your code here\n        return "";\n    }\n};`,
      java: `class Solution {\n    public String longestPalindrome(String s) {\n        // Your code here\n        return "";\n    }\n}`,
      go: `func longestPalindrome(s string) string {\n    // Your code here\n    return ""\n}`,
    },
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
      { input: "height = [4,2,0,3,2,5]", output: "9" },
    ],
    testCases: [
      { id: "tc1", input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6" },
      { id: "tc2", input: "[4,2,0,3,2,5]", expectedOutput: "9" },
    ],
    starterCode: {
      javascript: `function trap(height) {\n  // Your code here\n}`,
      python: `def trap(height):\n    # Your code here\n    pass`,
      typescript: `function trap(height: number[]): number {\n  // Your code here\n  return 0;\n}`,
      cpp: `class Solution {\npublic:\n    int trap(vector<int>& height) {\n        // Your code here\n        return 0;\n    }\n};`,
      java: `class Solution {\n    public int trap(int[] height) {\n        // Your code here\n        return 0;\n    }\n}`,
      go: `func trap(height []int) int {\n    // Your code here\n    return 0\n}`,
    },
  },
  {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    description: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.",
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" },
    ],
    testCases: [
      { id: "tc1", input: "[[1,4,5],[1,3,4],[2,6]]", expectedOutput: "[1,1,2,3,4,4,5,6]" },
      { id: "tc2", input: "[]", expectedOutput: "[]" },
    ],
    starterCode: {
      javascript: `function mergeKLists(lists) {\n  // Your code here\n}`,
      python: `def merge_k_lists(lists):\n    # Your code here\n    pass`,
      typescript: `function mergeKLists(lists: Array<ListNode | null>): ListNode | null {\n  // Your code here\n  return null;\n}`,
      cpp: `class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        // Your code here\n        return nullptr;\n    }\n};`,
      java: `class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Your code here\n        return null;\n    }\n}`,
      go: `func mergeKLists(lists []*ListNode) *ListNode {\n    // Your code here\n    return nil\n}`,
    },
  },
  {
    id: "word-search-ii",
    title: "Word Search II",
    difficulty: "Hard",
    description: "Given an `m x n` board of characters and a list of strings `words`, return all words on the board.\n\nEach word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.",
    examples: [
      { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]' },
    ],
    testCases: [
      { id: "tc1", input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]]\n["oath","pea","eat","rain"]', expectedOutput: '["eat","oath"]' },
      { id: "tc2", input: '[["a","b"],["c","d"]]\n["abcb"]', expectedOutput: '[]' },
    ],
    starterCode: {
      javascript: `function findWords(board, words) {\n  // Your code here\n}`,
      python: `def find_words(board, words):\n    # Your code here\n    pass`,
      typescript: `function findWords(board: string[][], words: string[]): string[] {\n  // Your code here\n  return [];\n}`,
      cpp: `class Solution {\npublic:\n    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {\n        // Your code here\n        return {};\n    }\n};`,
      java: `class Solution {\n    public List<String> findWords(char[][] board, String[] words) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}`,
      go: `func findWords(board [][]byte, words []string) []string {\n    // Your code here\n    return nil\n}`,
    },
  },
  {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    description: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).",
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.0" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.5" },
    ],
    testCases: [
      { id: "tc1", input: "[1,3]\n[2]", expectedOutput: "2" },
      { id: "tc2", input: "[1,2]\n[3,4]", expectedOutput: "2.5" },
    ],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n}`,
      python: `def find_median_sorted_arrays(nums1, nums2):\n    # Your code here\n    pass`,
      typescript: `function findMedianSortedArrays(nums1: number[], nums2: number[]): number {\n  // Your code here\n  return 0;\n}`,
      cpp: `class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        // Your code here\n        return 0.0;\n    }\n};`,
      java: `class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Your code here\n        return 0.0;\n    }\n}`,
      go: `func findMedianSortedArrays(nums1 []int, nums2 []int) float64 {\n    // Your code here\n    return 0.0\n}`,
    },
  },
];
