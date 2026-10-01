/**
 * Group Anagrams (LeetCode 49)
 *
 * Anagram: Word made by rearranging letters of another word (same characters, same frequencies).
 * Example: "eat", "tea", "ate" -> all sort to "aet".
 *
 * Problem:
 * Given an array of strings strs, group the anagrams together.
 * Return answer in any order.
 */

// ============================================================================
// Approach 1: Categorize by Sorted String (Most Common / Cleanest)
// Time Complexity : O(N * K log K) where N = number of strings, K = max length of a string
// Space Complexity: O(N * K) to store grouped strings in hash map
// ============================================================================
export function groupAnagramsSorted(strs: string[]): string[][] {
    const map = new Map<string, string[]>();

    for (const str of strs) {
        // Sort characters to create canonical key
        // "eat" -> ['e', 'a', 't'] -> ['a', 'e', 't'] -> "aet"
        const sortedKey = str.split("").sort().join("");

        if (!map.has(sortedKey)) {
            map.set(sortedKey, []);
        }

        map.get(sortedKey)!.push(str);
    }

    return Array.from(map.values());
}

// ============================================================================
// Approach 2: Categorize by Character Frequency Count (Optimal Time)
// Avoids sorting each string. Uses letter count array of size 26 as key.
// Time Complexity : O(N * K)
// Space Complexity: O(N * K)
// ============================================================================
export function groupAnagramsCount(strs: string[]): string[][] {
    const map = new Map<string, string[]>();

    for (const str of strs) {
        // 26 English lowercase letters (a-z)
        const count = new Array(26).fill(0);

        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i) - 97; // 97 is 'a'
            count[charCode]++;
        }

        // Delimiter key: e.g. "1#0#0#0#1#..."
        const key = count.join("#");

        if (!map.has(key)) {
            map.set(key, []);
        }

        map.get(key)!.push(str);
    }

    return Array.from(map.values());
}

// ============================================================================
// Demo Examples (runs when executed directly: npx tsx src/group-anagrams.ts)
// ============================================================================
const isDirectRun = process.argv[1]?.endsWith("group-anagrams.ts");

if (isDirectRun) {
    const words1 = ["eat", "tea", "tan", "ate", "nat", "bat"];
    console.log("Input:", words1);
    console.log("Method 1 (Sorted Key):", groupAnagramsSorted(words1));
    console.log("Method 2 (Count Key) :", groupAnagramsCount(words1));

    const words2 = [""];
    console.log("\nInput:", words2);
    console.log("Result:", groupAnagramsSorted(words2));

    const words3 = ["a"];
    console.log("\nInput:", words3);
    console.log("Result:", groupAnagramsSorted(words3));
}

