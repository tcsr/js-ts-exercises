/**
 * ============================================================================
 * GROUP ANAGRAMS (LeetCode 49)
 * 
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Group words that are anagrams / anagram permutations"
 *    - Metaphor: The DNA Fingerprint 🧬 (Scrambled letters share the same DNA signature).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: For each word, generate a canonical signature key.
 *    - Step 2: Store word in a Hash Map under that canonical key: `map.get(key).push(word)`.
 *    - Step 3: Return all bucket values: `Array.from(map.values())`.
 *
 * 3. THE APPROACH:
 *    - Approach 1: Sorted String Key ("eat" -> ['a','e','t'] -> "aet").
 *    - Approach 2: 26-Character Frequency Key ("eat" -> "1#0#...#1#0").
 *
 * 4. TRADE-OFFS:
 *    - Sorted String Key:
 *      * Time: O(N * K log K) where N = words count, K = max string length.
 *      * Space: O(N * K).
 *      * Pros: Cleanest, simplest, fastest to write under interview pressure.
 *    - 26-Character Frequency Key:
 *      * Time: O(N * K) linear time.
 *      * Space: O(N * K).
 *      * Pros: Avoids O(K log K) sorting; strictly superior when words are long (K > 100).
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Missing delimiter in count key: `[1, 11]` vs `[11, 1]` without `#` causes hash collision!
 *    - Empty strings `[""]` -> must return `[[""]]`.
 *    - Single characters `["a"]` -> must return `[["a"]]`.
 * ============================================================================
 */

// ============================================================================
// Approach 1: Categorize by Sorted String (Most Common / Cleanest)
// Time Complexity : O(N * K log K)
// Space Complexity: O(N * K)
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
