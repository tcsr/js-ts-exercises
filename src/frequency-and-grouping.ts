/**
 * ============================================================================
 * STRING & HASH MAP INTERVIEW MASTER PATTERNS
 * 
 * Master Study Blueprint for Every Problem:
 * 1. HOW TO REMEMBER (Mental Trigger & Metaphor)
 * 2. STEPS TO FOLLOW (Algorithm Recipe)
 * 3. THE APPROACH (Core Data Structure & Strategy)
 * 4. TRADE-OFFS (Why this over that?)
 * 5. PITFALLS & EDGE CASES (What breaks in interviews)
 * ============================================================================
 */

// ============================================================================
// 1. COUNT WORD FREQUENCIES
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "How many times did word X appear?" / "Histogram of words"
 *    - Metaphor: The Tally Stick 🪣 (Make a notch in the bucket every time you see an item).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Sanitize text (lowercase, strip edge punctuation).
 *    - Step 2: Tokenize using delimiter regex `[^\w]+`.
 *    - Step 3: Tally in Map using default fallback: `freq.set(w, (freq.get(w) ?? 0) + 1)`.
 *
 * 3. THE APPROACH:
 *    - Hash Map (`Map<string, number>`) provides O(1) average lookup and insertion.
 *
 * 4. TRADE-OFFS:
 *    - Map vs Plain Object `{}`:
 *      * Map prevents prototype key collision (e.g. word "constructor" or "toString").
 *      * Map preserves insertion order; plain object does not guarantee it.
 *    - Regex Split vs Character Scanner:
 *      * Regex split allocates intermediate arrays of all words (clean, readable).
 *      * Character pointer scanner uses zero array allocations (best for large streams).
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Empty string or all-whitespace returning map with `[""]` key -> must filter empty tokens!
 *    - Punctuation glued to words (`"world!"` vs `"world"`).
 *
 * Complexity: Time O(N) | Space O(U) where U = unique words
 */
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
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Find the top / mode / most common word" + "Tie-breaker rule"
 *    - Metaphor: The Champion's Belt 🏆 (Hold current leader; replace only if strictly beaten).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Build frequency map and record the highest frequency `maxCount`.
 *    - Step 2: Iterate unique keys in Map (which preserves original first-seen order!).
 *    - Step 3: Pick the first key that equals `maxCount` (or apply alphabetical tie-breaker).
 *
 * 3. THE APPROACH:
 *    - Two-pass frequency check. Pass 1 tallies counts. Pass 2 inspects candidates.
 *
 * 4. TRADE-OFFS:
 *    - Single-Pass tracking vs Two-Pass resolution:
 *      * Single-pass can track `maxCount` during insertion, but if the tie-breaker is
 *        "earliest seen in array", a later word might temporarily claim the lead.
 *      * Iterating `freq.entries()` in Pass 2 is still O(U) <= O(N) and 100% bug-free for ties.
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Empty input array -> must return `null`.
 *    - Forgetting the tie-breaker rule! Always clarify: "If tie, first seen or alphabetical?"
 *
 * Complexity: Time O(N) | Space O(U)
 */
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
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Find word with max length"
 *    - Metaphor: High-Water Mark 🌊 (Only record new record holder when length exceeds old).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Tokenize or scan text for word characters `[A-Za-z0-9_]`.
 *    - Step 2: Compare each candidate length with current champion `longestLen`.
 *    - Step 3: Return champion substring or `null` if empty.
 *
 * 3. THE APPROACH:
 *    - Baseline: Extract array of words with regex `\b\w+\b`, linear scan.
 *    - Optimized: Two-pointer index scanning without allocating any array.
 *
 * 4. TRADE-OFFS:
 *    - `text.match(/\b\w+\b/g)`: 3 lines of code, but allocates array of all words (O(N) memory).
 *    - Zero-Allocation Index Scanner: 20 lines of code, but strict O(1) extra memory.
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Text with no valid words (e.g. `"!!@#$%^"`).
 *    - Ties: `word.length > longest.length` preserves FIRST longest; `>=` keeps LAST.
 *
 * Complexity: Time O(N) | Space O(1) aux (optimized) or O(N) (regex)
 */
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
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Filter duplicates" / "Keep unique elements in order"
 *    - Metaphor: The Bouncer at the Cave Door 🚪 (If name on guest list, reject!).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Create a `seen = new Set<string>()`.
 *    - Step 2: Loop array; if `!seen.has(key)`, push to result and `seen.add(key)`.
 *    - Step 3: Return result array (preserves first occurrence order).
 *
 * 3. THE APPROACH:
 *    - Hash Set lookup has O(1) average time complexity.
 *
 * 4. TRADE-OFFS:
 *    - Hash Set: O(N) time, O(U) space. Works on any unsorted data, preserves order.
 *    - In-place Sorting + Two Pointers: O(N log N) time, O(1) space. Destroys original order!
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Using `Array.from(new Set(arr))` works for case-sensitive, but fails if case-insensitive
 *      deduplication is requested while preserving the original casing of the first word!
 *
 * Complexity: Time O(N) | Space O(U)
 */
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
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Words with same letters in different order" / "Group permutations"
 *    - Metaphor: The DNA Fingerprint 🧬 (Transform scrambled words into one canonical ID).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Define canonical key generator:
 *              Option A: sort letters (`"eat" -> "aet"`).
 *              Option B: 26-char frequency tuple (`"eat" -> "1#0#...#1#0"`).
 *    - Step 2: Group words in `Map<CanonicalKey, string[]>`.
 *    - Step 3: Return `Array.from(map.values())`.
 *
 * 3. THE APPROACH:
 *    - Hash Map where key is invariant across all anagrams of a word.
 *
 * 4. TRADE-OFFS:
 *    - Sorted Key (`word.split('').sort().join('')`):
 *      * Time: O(N * K log K). Simple, readable, 2 lines of code.
 *    - Count Key (`Array(26).fill(0)` + delimiter):
 *      * Time: O(N * K). Avoids O(K log K) sorting for very long strings (K > 100).
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Delimiter missing in count array: `[1, 11]` vs `[11, 1]` without `#` separator = collision!
 *    - Empty strings `[""]` -> must group into `[[""]]`.
 *
 * Complexity: Time O(N * K) or O(N * K log K) | Space O(N * K)
 */
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
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Order by most frequent first" / "Top K frequent"
 *    - Metaphor: The Frequency Shelves 🪜 (Shelf number = count. Empty shelves from top down).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Count occurrences of each item in a `Map`.
 *    - Step 2: Place items into `buckets` array where index = frequency.
 *    - Step 3: Iterate `buckets` from length down to 1; expand items by frequency.
 *
 * 3. THE APPROACH:
 *    - Bucket Sort avoids comparison sorting, achieving linear O(N) performance.
 *
 * 4. TRADE-OFFS:
 *    - Comparator Sort (`Array.sort()`):
 *      * Time: O(U log U). Simpler code, but scales slower as unique elements grow.
 *    - Bucket Sort:
 *      * Time: True O(N) linear time! Optimal when N is large. Extra O(N) bucket space.
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Bucket array size must be `items.length + 1` (an item could appear N times).
 *    - Deterministic tie-breaking (e.g. alphabetical) requires sorting items within same bucket.
 *
 * Complexity: Time O(N) (Bucket Sort) or O(U log U) (Comparator) | Space O(N)
 */
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
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Sort names / filenames" / "Natural human sort"
 *    - Metaphor: The Human Dictionary 📖 ("file2" comes BEFORE "file10", not after!).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Copy array (never mutate caller's original array unless asked!).
 *    - Step 2: Use `Intl.Collator` configured with `{ numeric: true, sensitivity: 'base' }`.
 *    - Step 3: Sort using `collator.compare(a, b)`.
 *
 * 3. THE APPROACH:
 *    - Unicode Collation Algorithm via standard ECMAScript `Intl.Collator`.
 *
 * 4. TRADE-OFFS:
 *    - Calling `a.localeCompare(b)` inside `.sort()`:
 *      * Creates and re-evaluates locale options on every single pairwise comparison (slow).
 *    - Creating one `new Intl.Collator()` instance:
 *      * Reuses compiled comparison rules, running up to 10x faster in V8.
 *
 * 5. PITFALLS & EDGE CASES:
 *    - JavaScript default `.sort()` does UTF-16 code-unit sorting (`"10"` sorts before `"2"`).
 *    - Capital letters sorting before lowercase (`"Apple"` before `"banana"`) unless base sensitivity set.
 *
 * Complexity: Time O(N log N * L) | Space O(N) copy
 */
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
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "First non-repeating character" / "Single unique character in stream"
 *    - Metaphor: Two-Pass Radar 📡 (Pass 1 counts sightings; Pass 2 scans from left for count === 1).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: First pass over string to count frequencies of each character.
 *    - Step 2: Second pass over string from index 0 to N-1.
 *    - Step 3: Return first index `i` where `count === 1`. Return `-1` if none found.
 *
 * 3. THE APPROACH:
 *    - Two linear passes.
 *
 * 4. TRADE-OFFS:
 *    - `Map<string, number>`:
 *      * Generic, supports emojis and unicode. Incurs Map hash and GC overhead.
 *    - `new Int32Array(26)`:
 *      * Fixed stack buffer. 0 heap object allocations. Direct L1 CPU cache indexing.
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Trying to solve in a single pass without second pass (you cannot know if a char will
 *      repeat later until you finish reading the string!).
 *    - Case where every character repeats (`"aabb"`) -> must return `-1`.
 *
 * Complexity: Time O(N) | Space O(1) bounded by alphabet (26 letters)
 */
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
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Contains duplicate" (LC 217) or "Find all duplicates in array" (LC 442)
 *    - Metaphor: The Negative Flag 🚩 (Flip sign of `nums[val - 1]` to mark: "I was here!").
 *
 * 2. STEPS TO FOLLOW:
 *    - For `hasDuplicates`: Check `seen.has(x)`. Return `true` immediately on first collision.
 *    - For `findDuplicatesInPlace` (numbers in range [1, n]):
 *      * Step 1: Look at index `Math.abs(nums[i]) - 1`.
 *      * Step 2: If value at that index is already negative -> duplicate spotted!
 *      * Step 3: Else negate that value: `nums[target] = -nums[target]`.
 *      * Step 4: Restore original signs before returning.
 *
 * 3. THE APPROACH:
 *    - In-place index negation uses array itself as a hash table.
 *
 * 4. TRADE-OFFS:
 *    - `Set` / Frequency Map:
 *      * Works for any data type (strings, negative numbers, floats). Uses O(N) extra space.
 *    - In-Place Sign Negation (LC 442):
 *      * Strict O(1) auxiliary memory! Only applies when input numbers are in range [1, n].
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Forgetting `Math.abs(nums[i])`: because elements get negated, looking up without `Math.abs()`
 *      will produce a negative index and crash!
 *    - Failing to restore array signs leaves caller's data mutated.
 *
 * Complexity: Time O(N) | Space O(1) auxiliary (in-place) or O(N) (Set)
 */
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
// 10. TRANSFORM / GROUP COLLECTION DATA (Object.groupBy Polyfill & Aggregator)
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Group list of objects by category / status / date" / "SQL GROUP BY"
 *    - Metaphor: Sorting mail into pigeonholes 🗄️ (Compute drawer key; insert into drawer).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Initialize empty result record `{}`.
 *    - Step 2: Loop items; compute key using selector function `keySelector(item)`.
 *    - Step 3: If bucket doesn't exist, create empty array: `result[key] ??= []`.
 *    - Step 4: Push item into bucket.
 *
 * 3. THE APPROACH:
 *    - Hash partition with TypeScript generics for compile-time safety.
 *
 * 4. TRADE-OFFS:
 *    - Custom `groupBy`:
 *      * Works in all JavaScript environments, easily chained with custom reducers.
 *    - Native `Object.groupBy` / `Map.groupBy` (ES2024 / Node 21+):
 *      * Engine-level C++ speed. `Map.groupBy` allows complex objects as grouping keys!
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Keys that are `null` or `undefined` -> `Object.groupBy` stringifies them to `"null"`.
 *    - Memory accumulation: grouping 1,000,000 items creates large nested arrays.
 *
 * Complexity: Time O(N) | Space O(N)
 */
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
