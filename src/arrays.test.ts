import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
    removeDuplicates,
    removDupes,
    twoSum,
    twoSumSorted,
    isPalindrome,
    maxSum,
    lengthOfLongestSubstring,
    lengthOfLongestSubstringJump,
    getLongestSubstring,
} from "./arrays.js";

describe("1. Remove Duplicates from Sorted Array (LeetCode 26)", () => {
    it("should remove duplicates in-place and return unique count", () => {
        const nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
        const res = removeDuplicates(nums);
        assert.equal(res.duplicateCount, 5);
        assert.deepStrictEqual(res.uniqueArray, [0, 1, 2, 3, 4]);
    });

    it("removDupes: should return count of unique items", () => {
        const nums = [1, 1, 2];
        assert.equal(removDupes(nums), 2);
    });

    it("should handle empty array", () => {
        assert.equal(removDupes([]), 0);
    });
});

describe("2. Two Sum (LeetCode 1 & 167)", () => {
    it("twoSum: should return indices of elements adding to target", () => {
        const nums = [2, 7, 11, 15];
        assert.deepStrictEqual(twoSum(nums, 9), [0, 1]);
    });

    it("twoSum: should handle negative numbers", () => {
        const nums = [-3, 4, 3, 90];
        assert.deepStrictEqual(twoSum(nums, 0), [0, 2]);
    });

    it("twoSumSorted (LeetCode 167): should find pair in O(1) space", () => {
        const nums = [2, 7, 11, 15];
        assert.deepStrictEqual(twoSumSorted(nums, 18), [1, 2]); // 7 + 11 = 18
    });
});

describe("3. Palindrome Check (LeetCode 125)", () => {
    it("should validate string palindromes", () => {
        assert.equal(isPalindrome("madam"), true);
        assert.equal(isPalindrome("racecar"), true);
        assert.equal(isPalindrome("hello"), false);
    });

    it("should validate numeric palindromes", () => {
        assert.equal(isPalindrome(121), true);
        assert.equal(isPalindrome(123), false);
    });
});

describe("4. Fixed-Size Sliding Window (Max Sum of Size K)", () => {
    it("should find maximum sum of K consecutive elements", () => {
        const nums = [2, 1, 5, 1, 3, 2];
        assert.equal(maxSum(nums, 3), 9); // [5, 1, 3] = 9
    });

    it("should handle all negative numbers correctly", () => {
        const nums = [-2, -1, -5, -3];
        assert.equal(maxSum(nums, 2), -3); // [-2, -1] = -3
    });
});

describe("5. Dynamic Sliding Window (LeetCode 3: Longest Substring Without Repeating)", () => {
    const implementations = [
        { name: "lengthOfLongestSubstring (Set with while-loop)", fn: lengthOfLongestSubstring },
        { name: "lengthOfLongestSubstringJump (Direct Jump O(N))", fn: lengthOfLongestSubstringJump },
    ];

    for (const { name, fn } of implementations) {
        it(`${name}: should find length of longest substring without repeating characters`, () => {
            assert.equal(fn("abcabcbb"), 3); // "abc"
            assert.equal(fn("bbbbb"), 1);    // "b"
            assert.equal(fn("pwwkew"), 3);   // "wke"
            assert.equal(fn(""), 0);
        });
    }

    it("getLongestSubstring: should return the actual substring string", () => {
        assert.equal(getLongestSubstring("abcabcbb"), "abc");
        assert.equal(getLongestSubstring("pwwkew"), "wke");
        assert.equal(getLongestSubstring(""), "");
    });
});
