import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
    countWordFrequencies,
    findMostFrequentWord,
    findLongestWord,
    findLongestWordZeroAlloc,
    removeDuplicateWords,
    groupAnagrams,
    sortByFrequency,
    sortByFrequencyBucket,
    sortAlphabetical,
    getCharFrequency,
    firstUniqueChar,
    firstUniqueCharOptimized,
    hasDuplicates,
    findAllDuplicates,
    findDuplicatesInPlace,
    groupBy,
    aggregateBy,
} from "./frequency-and-grouping.js";

describe("1. Count Word Frequencies", () => {
    it("should count word occurrences case-insensitively and ignore punctuation", () => {
        const text = "Apple, banana! Apple; ORANGE apple banana.";
        const freq = countWordFrequencies(text);

        assert.equal(freq.get("apple"), 3);
        assert.equal(freq.get("banana"), 2);
        assert.equal(freq.get("orange"), 1);
    });

    it("should return empty map for empty text or whitespace", () => {
        assert.equal(countWordFrequencies("").size, 0);
        assert.equal(countWordFrequencies("   , . ;  ").size, 0);
    });
});

describe("2. Find First / Most Frequent Word", () => {
    it("should find most frequent word with first occurrence on tie", () => {
        const words = ["dog", "cat", "bird", "cat", "dog"];
        // Both "dog" and "cat" have count 2. Earliest seen in array is "dog"
        assert.equal(findMostFrequentWord(words, "first"), "dog");
    });

    it("should break ties lexicographically when specified", () => {
        const words = ["dog", "cat", "bird", "cat", "dog"];
        // "cat" < "dog"
        assert.equal(findMostFrequentWord(words, "lexicographical"), "cat");
    });

    it("should return null for empty array", () => {
        assert.equal(findMostFrequentWord([]), null);
    });
});

describe("3. Find Longest Word", () => {
    const implementations = [
        { name: "findLongestWord (regex)", fn: findLongestWord },
        { name: "findLongestWordZeroAlloc (pointers O(1) space)", fn: findLongestWordZeroAlloc },
    ];

    for (const { name, fn } of implementations) {
        it(`${name}: should return longest word in a sentence`, () => {
            const text = "The quick brown fox jumps over the extraordinary lazy dog!";
            assert.equal(fn(text), "extraordinary");
        });

        it(`${name}: should return first longest word when ties exist`, () => {
            const text = "blue pink gray gold";
            assert.equal(fn(text), "blue");
        });

        it(`${name}: should return null for empty string or only symbols`, () => {
            assert.equal(fn(""), null);
            assert.equal(fn("!@#$%^"), null);
        });
    }
});

describe("4. Remove Duplicate Words", () => {
    it("should remove duplicates preserving insertion order", () => {
        const input = ["apple", "banana", "apple", "cherry", "banana"];
        assert.deepStrictEqual(removeDuplicateWords(input), ["apple", "banana", "cherry"]);
    });

    it("should support case-insensitive duplicate removal", () => {
        const input = ["Apple", "apple", "BANANA", "banana"];
        assert.deepStrictEqual(removeDuplicateWords(input, true), ["Apple", "BANANA"]);
    });

    it("should return empty array for empty input", () => {
        assert.deepStrictEqual(removeDuplicateWords([]), []);
    });
});

describe("5. Group Anagrams", () => {
    function normalize(groups: string[][]): string[][] {
        return groups
            .map((g) => [...g].sort())
            .sort((a, b) => a.join("").localeCompare(b.join("")));
    }

    it("should group anagrams correctly", () => {
        const input = ["eat", "tea", "tan", "ate", "nat", "bat"];
        const expected = [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]];
        assert.deepStrictEqual(normalize(groupAnagrams(input)), normalize(expected));
    });

    it("should handle single letter and empty string", () => {
        assert.deepStrictEqual(groupAnagrams([""]), [[""]]);
        assert.deepStrictEqual(groupAnagrams(["a"]), [["a"]]);
    });
});

describe("6. Sort by Frequency", () => {
    const implementations = [
        { name: "sortByFrequency (Comparator O(U log U))", fn: sortByFrequency },
        { name: "sortByFrequencyBucket (Bucket Sort O(N))", fn: sortByFrequencyBucket },
    ];

    for (const { name, fn } of implementations) {
        it(`${name}: should sort items by descending frequency with alphabetical tie-break`, () => {
            const input = ["banana", "apple", "banana", "cherry", "apple", "banana", "date"];
            // banana: 3, apple: 2, cherry: 1, date: 1
            const expected = ["banana", "banana", "banana", "apple", "apple", "cherry", "date"];
            assert.deepStrictEqual(fn(input), expected);
        });

        it(`${name}: should handle empty array`, () => {
            assert.deepStrictEqual(fn([]), []);
        });
    }
});

describe("7. Sort Alphabetically", () => {
    it("should naturally sort numbers inside strings", () => {
        const input = ["file10.txt", "file2.txt", "file1.txt", "file20.txt"];
        const expected = ["file1.txt", "file2.txt", "file10.txt", "file20.txt"];
        assert.deepStrictEqual(sortAlphabetical(input, { natural: true }), expected);
    });

    it("should handle case-insensitive sorting", () => {
        const input = ["banana", "Apple", "cherry"];
        const expected = ["Apple", "banana", "cherry"];
        assert.deepStrictEqual(sortAlphabetical(input, { caseSensitive: false }), expected);
    });
});

describe("8. Character Frequency & First Unique Character", () => {
    it("should count character frequencies", () => {
        const freq = getCharFrequency("banana");
        assert.equal(freq.get("b"), 1);
        assert.equal(freq.get("a"), 3);
        assert.equal(freq.get("n"), 2);
    });

    it("firstUniqueChar (Map): should find index of first unique character", () => {
        assert.equal(firstUniqueChar("leetcode"), 0); // 'l'
        assert.equal(firstUniqueChar("loveleetcode"), 2); // 'v'
        assert.equal(firstUniqueChar("aabb"), -1); // none
    });

    it("firstUniqueCharOptimized (Int32Array(26)): should find index of first unique character", () => {
        assert.equal(firstUniqueCharOptimized("leetcode"), 0); // 'l'
        assert.equal(firstUniqueCharOptimized("loveleetcode"), 2); // 'v'
        assert.equal(firstUniqueCharOptimized("aabb"), -1); // none
    });
});

describe("9. Find Duplicate Elements", () => {
    it("should detect if duplicates exist", () => {
        assert.equal(hasDuplicates([1, 2, 3, 1]), true);
        assert.equal(hasDuplicates([1, 2, 3, 4]), false);
        assert.equal(hasDuplicates([]), false);
    });

    it("findAllDuplicates (Set): should collect all duplicate elements", () => {
        const nums = [4, 3, 2, 7, 8, 2, 3, 1];
        const dups = findAllDuplicates(nums).sort((a, b) => a - b);
        assert.deepStrictEqual(dups, [2, 3]);
    });

    it("findDuplicatesInPlace (O(1) Auxiliary Space LeetCode 442): should collect duplicates without extra memory", () => {
        const nums = [4, 3, 2, 7, 8, 2, 3, 1];
        const dups = findDuplicatesInPlace(nums).sort((a, b) => a - b);
        assert.deepStrictEqual(dups, [2, 3]);
        // Also verify original array values were properly preserved / restored
        assert.deepStrictEqual(nums, [4, 3, 2, 7, 8, 2, 3, 1]);
    });
});

describe("10. Transform / Group Collection Data", () => {
    const hunters = [
        { name: "Ogg", tribe: "Mammoth", score: 10 },
        { name: "Grok", tribe: "Saber", score: 20 },
        { name: "Thag", tribe: "Mammoth", score: 30 },
    ];

    it("should group objects by key selector", () => {
        const grouped = groupBy(hunters, (h) => h.tribe);
        assert.equal(grouped["Mammoth"]?.length, 2);
        assert.equal(grouped["Saber"]?.length, 1);
        assert.deepStrictEqual(grouped["Mammoth"]?.map((h) => h.name), ["Ogg", "Thag"]);
    });

    it("should aggregate values per group", () => {
        const totalScores = aggregateBy(
            hunters,
            (h) => h.tribe,
            (acc, curr) => acc + curr.score,
            0
        );
        assert.equal(totalScores["Mammoth"], 40);
        assert.equal(totalScores["Saber"], 20);
    });
});
