/**
 * ============================================================================
 * STRING & HASH MAP INTERVIEW PATTERNS
 * 
 * Each problem follows the 6-Step Framework:
 * Clarify → Approach → Code → Test → Complexity → Optimization
 * ============================================================================
 */

// ============================================================================
// 1. COUNT WORD FREQUENCIES
// ----------------------------------------------------------------------------
// Clarify:
//   - Input: Raw text string (may contain punctuation, multiple spaces, mixed casing).
//   - Output: Map of word -> count.
//   - Edge cases: Empty string, all punctuation, numbers, multiple spaces.
// Approach:
//   - Normalize casing (to lower), split by non-word delimiters `[^\w]+`, ignore empty tokens.
//   - Insert into Map<string, number>, increment count.
// Complexity:
//   - Time: O(N) where N is length of string.
//   - Space: O(U) where U is number of unique words.
// Optimization:
//   - For streaming or huge inputs, scan characters with two pointers to avoid regex allocations.
// ============================================================================
export function countWordFrequencies(text: string): Map<string, number> {
    const freq = new Map<string, number>();
    if (!text || text.trim().length === 0) return freq;

    const words = text
        .toLowerCase()
        .split(/[^\w]+/)
        .filter((w) => w.length > 0);

    for (const word of words) {
        freq.set(word, (freq.get(word) ?? 0) + 1);
    }

    return freq;
}

// ============================================================================
// 2. FIND FIRST / MOST FREQUENT WORD
// ----------------------------------------------------------------------------
// Clarify:
//   - Input: Array of words (or sentence).
//   - Output: Most frequent word (or null if empty).
//   - Tie-breaker: "first" (earliest seen max) or "lexicographical" (alphabetical).
// Approach:
//   - Build frequency map while simultaneously tracking max count and candidate word.
// Complexity:
//   - Time: O(N) single pass.
//   - Space: O(U) unique words.
// Optimization:
//   - Single pass: update best candidate in the same loop that builds frequency.
// ============================================================================
export function findMostFrequentWord(
    words: string[],
    tieBreaker: "first" | "lexicographical" = "first"
): string | null {
    if (words.length === 0) return null;

    const freq = new Map<string, number>();
    let maxCount = 0;

    // Pass 1: Build frequencies and find maxCount
    for (const word of words) {
        const count = (freq.get(word) ?? 0) + 1;
        freq.set(word, count);
        if (count > maxCount) {
            maxCount = count;
        }
    }

    // Pass 2: Map preserves insertion order, so first key with maxCount is earliest seen
    let bestWord: string | null = null;
    for (const [word, count] of freq.entries()) {
        if (count === maxCount) {
            if (bestWord === null) {
                bestWord = word;
            } else if (tieBreaker === "lexicographical" && word.localeCompare(bestWord) < 0) {
                bestWord = word;
            }
        }
    }

    return bestWord;
}

// ============================================================================
// 3. FIND LONGEST WORD
// ----------------------------------------------------------------------------
// Clarify:
//   - Input: Sentence string or word array.
//   - Output: Longest word (null if empty).
//   - Tie-breaker: First longest word encountered.
// Approach:
//   - Tokenize alphanumeric words.
//   - Scan words, compare `word.length > longest.length`.
// Complexity:
//   - Time: O(N) where N is text length.
//   - Space: O(W) where W is length of longest word (O(1) extra if index pointers).
// Optimization:
//   - One-pass index scanner avoids allocating an array of all words.
// ============================================================================
export function findLongestWord(text: string): string | null {
    if (!text || text.trim().length === 0) return null;

    const words = text.match(/\b\w+\b/g);
    if (!words || words.length === 0) return null;

    let longest = words[0]!;
    for (let i = 1; i < words.length; i++) {
        if (words[i]!.length > longest.length) {
            longest = words[i]!;
        }
    }

    return longest;
}

/**
 * Ultra-Optimized: O(N) Time, O(1) Auxiliary Space.
 * Scans word boundaries using pointers; avoids allocating intermediate arrays.
 */
export function findLongestWordZeroAlloc(text: string): string | null {
    if (!text) return null;

    let longestStart = -1;
    let longestLen = 0;
    let currentStart = -1;

    for (let i = 0; i <= text.length; i++) {
        const isWordChar =
            i < text.length &&
            ((text.charCodeAt(i) >= 65 && text.charCodeAt(i) <= 90) ||
             (text.charCodeAt(i) >= 97 && text.charCodeAt(i) <= 122) ||
             (text.charCodeAt(i) >= 48 && text.charCodeAt(i) <= 57) ||
             text.charCodeAt(i) === 95);

        if (isWordChar) {
            if (currentStart === -1) {
                currentStart = i;
            }
        } else {
            if (currentStart !== -1) {
                const len = i - currentStart;
                if (len > longestLen) {
                    longestLen = len;
                    longestStart = currentStart;
                }
                currentStart = -1;
            }
        }
    }

    if (longestLen === 0) return null;
    return text.slice(longestStart, longestStart + longestLen);
}

// ============================================================================
// 4. REMOVE DUPLICATE WORDS
// ----------------------------------------------------------------------------
// Clarify:
//   - Input: Array of words.
//   - Output: Array with duplicate words removed, preserving original insertion order.
//   - Case sensitivity: configurable (default: case-sensitive).
// Approach:
//   - Use a Set<string> to track seen words.
//   - Filter array: keep word if not in Set, then add to Set.
// Complexity:
//   - Time: O(N) where N is words count.
//   - Space: O(U) where U is unique words.
// Optimization:
//   - If input array is already sorted, use two pointers in-place for O(1) space.
// ============================================================================
export function removeDuplicateWords(
    words: string[],
    caseInsensitive = false
): string[] {
    const seen = new Set<string>();
    const result: string[] = [];

    for (const word of words) {
        const key = caseInsensitive ? word.toLowerCase() : word;
        if (!seen.has(key)) {
            seen.add(key);
            result.push(word);
        }
    }

    return result;
}

// ============================================================================
// 5. GROUP ANAGRAMS (LeetCode 49)
// ----------------------------------------------------------------------------
// Clarify:
//   - Input: string[] of words.
//   - Output: string[][] grouped by anagram signature.
// Approach:
//   - Sort word characters or use 26-char frequency tuple as map key.
// Complexity:
//   - Time: O(N * K) with count key or O(N * K log K) with sorted key.
//   - Space: O(N * K).
// ============================================================================
export function groupAnagrams(strs: string[]): string[][] {
    const map = new Map<string, string[]>();

    for (const str of strs) {
        // Frequency key: 26 letter count string "1#0#2#..."
        const counts = new Array(26).fill(0);
        for (let i = 0; i < str.length; i++) {
            counts[str.charCodeAt(i) - 97]++;
        }
        const key = counts.join("#");

        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.push(str);
    }

    return Array.from(map.values());
}

// ============================================================================
// 6. SORT BY FREQUENCY (LeetCode 451 / 692)
// ----------------------------------------------------------------------------
// Clarify:
//   - Input: Array of items (words or characters).
//   - Output: Items sorted by descending frequency; ties sorted alphabetically.
// Approach:
//   - Step 1: Count frequency using Map.
//   - Step 2: Bucket Sort or Comparator Sort: `freqB - freqA || a.localeCompare(b)`.
// Complexity:
//   - Time: O(N log N) with comparator, or O(N) with Bucket Sort.
//   - Space: O(N).
// Optimization:
//   - Bucket Sort (array of buckets indexed by frequency) achieves linear O(N) time.
// ============================================================================
export function sortByFrequency(items: string[]): string[] {
    const freq = new Map<string, number>();
    for (const item of items) {
        freq.set(item, (freq.get(item) ?? 0) + 1);
    }

    // Sort unique items: primary = frequency desc, secondary = alphabetical asc
    const unique = Array.from(freq.keys()).sort((a, b) => {
        const diff = freq.get(b)! - freq.get(a)!;
        if (diff !== 0) return diff;
        return a.localeCompare(b);
    });

    // Expand items by their frequency
    const result: string[] = [];
    for (const item of unique) {
        const count = freq.get(item)!;
        for (let i = 0; i < count; i++) {
            result.push(item);
        }
    }

    return result;
}

/**
 * Ultra-Optimized: O(N) Linear Time Bucket Sort (LeetCode 451).
 * Avoids O(U log U) comparison sorting by using frequency as array index.
 */
export function sortByFrequencyBucket(items: string[]): string[] {
    if (items.length === 0) return [];

    const freq = new Map<string, number>();
    for (const item of items) {
        freq.set(item, (freq.get(item) ?? 0) + 1);
    }

    // Buckets indexed from 0 to items.length
    // bucket[f] contains all elements with frequency f
    const buckets: string[][] = Array.from({ length: items.length + 1 }, () => []);
    for (const [item, count] of freq.entries()) {
        buckets[count]!.push(item);
    }

    const result: string[] = [];
    // Traverse from highest possible frequency down to 1
    for (let f = buckets.length - 1; f >= 1; f--) {
        const bucket = buckets[f]!;
        if (bucket.length > 0) {
            // Tie-break alphabetically
            bucket.sort((a, b) => a.localeCompare(b));
            for (const item of bucket) {
                for (let k = 0; k < f; k++) {
                    result.push(item);
                }
            }
        }
    }

    return result;
}

// ============================================================================
// 7. SORT ALPHABETICALLY (With Natural & Custom Options)
// ----------------------------------------------------------------------------
// Clarify:
//   - Input: Array of strings.
//   - Options: Natural numeric sorting ("item2" before "item10"), case-insensitivity.
//   - Output: Sorted array (non-mutating).
// Approach:
//   - Clone array with slice() or spread [...words].
//   - Use Intl.Collator or String.prototype.localeCompare with numeric: true.
// Complexity:
//   - Time: O(N log N * L) where L is string length.
//   - Space: O(N) for returned copy.
// Optimization:
//   - Pre-instantiate Intl.Collator instance for reuse instead of creating one per comparison.
// ============================================================================
export function sortAlphabetical(
    words: string[],
    options: { natural?: boolean; caseSensitive?: boolean } = {}
): string[] {
    const { natural = true, caseSensitive = false } = options;

    const collator = new Intl.Collator(undefined, {
        numeric: natural,
        sensitivity: caseSensitive ? "case" : "base",
    });

    return [...words].sort((a, b) => collator.compare(a, b));
}

// ============================================================================
// 8. CHARACTER FREQUENCY & FIRST UNIQUE CHAR (LeetCode 387)
// ----------------------------------------------------------------------------
// Clarify:
//   - Input: String.
//   - Outputs:
//       1) getCharFrequency(str): Map<char, count>
//       2) firstUniqueChar(str): index of first non-repeating character (-1 if none)
// Approach:
//   - Pass 1: Build frequency map.
//   - Pass 2: Iterate characters; return index of first char with frequency === 1.
// Complexity:
//   - Time: O(N) two passes.
//   - Space: O(1) bounded by alphabet (max 26 lowercase or 128 ASCII).
// Optimization:
//   - Use fixed-size Int32Array(26) for ASCII lowercase for fastest cache performance.
// ============================================================================
export function getCharFrequency(str: string): Map<string, number> {
    const freq = new Map<string, number>();
    for (const char of str) {
        freq.set(char, (freq.get(char) ?? 0) + 1);
    }
    return freq;
}

export function firstUniqueChar(str: string): number {
    const freq = new Map<string, number>();

    // Pass 1: count occurrences
    for (let i = 0; i < str.length; i++) {
        const char = str[i]!;
        freq.set(char, (freq.get(char) ?? 0) + 1);
    }

    // Pass 2: find first index with count === 1
    for (let i = 0; i < str.length; i++) {
        if (freq.get(str[i]!) === 1) {
            return i;
        }
    }

    return -1;
}

/**
 * Ultra-Optimized: O(N) Time, O(1) Auxiliary Space (LeetCode 387).
 * Uses fixed-size typed array Int32Array(26) for zero heap allocation and direct memory indexing.
 * Assumes lowercase English characters ('a'-'z').
 */
export function firstUniqueCharOptimized(str: string): number {
    const counts = new Int32Array(26);

    for (let i = 0; i < str.length; i++) {
        counts[str.charCodeAt(i) - 97]++;
    }

    for (let i = 0; i < str.length; i++) {
        if (counts[str.charCodeAt(i) - 97] === 1) {
            return i;
        }
    }

    return -1;
}

// ============================================================================
// 9. FIND DUPLICATE ELEMENTS (LeetCode 217 & 442)
// ----------------------------------------------------------------------------
// Clarify:
//   - hasDuplicates(arr): boolean (does ANY element repeat?)
//   - findAllDuplicates(arr): elements that appear >= 2 times.
// Approach:
//   - hasDuplicates: Set early-exit on first seen collision.
//   - findAllDuplicates: Track seen and addedToDuplicates sets (or frequency map).
// Complexity:
//   - Time: O(N)
//   - Space: O(N)
// Optimization:
//   - hasDuplicates stops immediately at first duplicate -> O(1) best case.
//   - findDuplicatesInPlace achieves O(1) extra space using index sign-negation!
// ============================================================================
export function hasDuplicates<T>(items: T[]): boolean {
    const seen = new Set<T>();
    for (const item of items) {
        if (seen.has(item)) return true;
        seen.add(item);
    }
    return false;
}

export function findAllDuplicates<T>(items: T[]): T[] {
    const seen = new Set<T>();
    const duplicates = new Set<T>();

    for (const item of items) {
        if (seen.has(item)) {
            duplicates.add(item);
        } else {
            seen.add(item);
        }
    }

    return Array.from(duplicates);
}

/**
 * Ultra-Optimized: O(N) Time, O(1) Auxiliary Space (LeetCode 442).
 * Works when integers are in range [1, n].
 * Uses numbers as target indices (val - 1) and negates the value at that index to mark visited.
 * Restores original array before returning.
 */
export function findDuplicatesInPlace(nums: number[]): number[] {
    const duplicates: number[] = [];

    for (let i = 0; i < nums.length; i++) {
        const val = Math.abs(nums[i]!);
        const targetIndex = val - 1;

        if (nums[targetIndex]! < 0) {
            duplicates.push(val);
        } else {
            nums[targetIndex] = -nums[targetIndex]!;
        }
    }

    // Restore array signs to avoid mutating caller's data
    for (let i = 0; i < nums.length; i++) {
        nums[i] = Math.abs(nums[i]!);
    }

    return duplicates;
}

// ============================================================================
// 10. TRANSFORM / GROUP COLLECTION DATA (Object.groupBy polyfill & Aggregate)
// ----------------------------------------------------------------------------
// Clarify:
//   - Input: Array of entities/objects, keySelector function.
//   - Output: Object grouping items into arrays by key.
// Approach:
//   - Array.prototype.reduce or simple for..of loop with Record<K, T[]>.
// Complexity:
//   - Time: O(N)
//   - Space: O(N)
// Optimization:
//   - Generic typed groupBy works on any property key (string | number | symbol).
// ============================================================================
export function groupBy<T, K extends PropertyKey>(
    items: T[],
    keySelector: (item: T) => K
): Record<K, T[]> {
    const result = {} as Record<K, T[]>;

    for (const item of items) {
        const key = keySelector(item);
        if (!result[key]) {
            result[key] = [];
        }
        result[key].push(item);
    }

    return result;
}

export function aggregateBy<T, K extends PropertyKey, V>(
    items: T[],
    keySelector: (item: T) => K,
    reducer: (accumulator: V, current: T) => V,
    initialValue: V
): Record<K, V> {
    const grouped = groupBy(items, keySelector);
    const result = {} as Record<K, V>;

    for (const key in grouped) {
        result[key] = grouped[key]!.reduce(reducer, initialValue);
    }

    return result;
}

// ============================================================================
// Demo runner (Runs only when executed directly: npx tsx src/frequency-and-grouping.ts)
// ============================================================================
if (process.argv[1]?.endsWith("frequency-and-grouping.ts")) {
    console.log("=== 1. Word Frequencies ===");
    console.log(countWordFrequencies("Hunt mammoth, hunt deer, eat mammoth!"));

    console.log("\n=== 2. Most Frequent Word ===");
    console.log(findMostFrequentWord(["cave", "fire", "rock", "fire", "mammoth"]));

    console.log("\n=== 3. Longest Word ===");
    console.log(findLongestWord("Me love big prehistoric dinosaur bones"));

    console.log("\n=== 4. Remove Duplicate Words ===");
    console.log(removeDuplicateWords(["fire", "rock", "fire", "spear", "rock"]));

    console.log("\n=== 5. Group Anagrams ===");
    console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));

    console.log("\n=== 6. Sort By Frequency ===");
    console.log(sortByFrequency(["apple", "banana", "apple", "cherry", "banana", "apple"]));

    console.log("\n=== 7. Sort Alphabetically (Natural) ===");
    console.log(sortAlphabetical(["file10.txt", "file2.txt", "file1.txt"]));

    console.log("\n=== 8. First Unique Character ===");
    console.log("loveleetcode -> index:", firstUniqueChar("loveleetcode"));

    console.log("\n=== 9. Find Duplicates ===");
    console.log("Has dups:", hasDuplicates([1, 2, 3, 2, 4]));
    console.log("All dups:", findAllDuplicates([4, 3, 2, 7, 8, 2, 3, 1]));

    console.log("\n=== 10. Group & Aggregate Collection ===");
    const hunters = [
        { name: "Ogg", tribe: "Bear", preyCount: 5 },
        { name: "Grok", tribe: "Wolf", preyCount: 3 },
        { name: "Thag", tribe: "Bear", preyCount: 8 },
    ];
    console.log("Grouped by tribe:", groupBy(hunters, (h) => h.tribe));
    console.log("Total prey by tribe:", aggregateBy(
        hunters,
        (h) => h.tribe,
        (acc, h) => acc + h.preyCount,
        0
    ));
}
