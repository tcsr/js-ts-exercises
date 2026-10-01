import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { groupAnagramsSorted, groupAnagramsCount } from "./group-anagrams.js";

/**
 * Helper to normalize result for comparison.
 * In Group Anagrams, the order of groups and words inside groups does not matter.
 * Sorting inner arrays and the outer array makes assertion reliable.
 */
function normalize(groups: string[][]): string[][] {
    return groups
        .map((group) => [...group].sort())
        .sort((a, b) => a.join("").localeCompare(b.join("")));
}

// Run identical test suite for both implementations
const implementations = [
    { name: "groupAnagramsSorted (O(N * K log K))", fn: groupAnagramsSorted },
    { name: "groupAnagramsCount (O(N * K))", fn: groupAnagramsCount },
];

for (const { name, fn } of implementations) {
    describe(name, () => {
        it("should group standard anagrams together", () => {
            const input = ["eat", "tea", "tan", "ate", "nat", "bat"];
            const expected = [
                ["bat"],
                ["nat", "tan"],
                ["ate", "eat", "tea"],
            ];

            const result = fn(input);
            assert.deepStrictEqual(normalize(result), normalize(expected));
        });

        it("should handle empty string in array", () => {
            const input = [""];
            const expected = [[""]];

            const result = fn(input);
            assert.deepStrictEqual(normalize(result), normalize(expected));
        });

        it("should handle single character string", () => {
            const input = ["a"];
            const expected = [["a"]];

            const result = fn(input);
            assert.deepStrictEqual(normalize(result), normalize(expected));
        });

        it("should handle words with repeated letters", () => {
            const input = ["aab", "aba", "baa", "abc"];
            const expected = [
                ["abc"],
                ["aab", "aba", "baa"],
            ];

            const result = fn(input);
            assert.deepStrictEqual(normalize(result), normalize(expected));
        });

        it("should handle words with no anagram pairs", () => {
            const input = ["cat", "dog", "bird"];
            const expected = [["bird"], ["cat"], ["dog"]];

            const result = fn(input);
            assert.deepStrictEqual(normalize(result), normalize(expected));
        });

        it("should return empty array for empty input", () => {
            const input: string[] = [];
            const expected: string[][] = [];

            const result = fn(input);
            assert.deepStrictEqual(normalize(result), normalize(expected));
        });
    });
}
