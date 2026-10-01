
let person = {
    name: 'Chandra',
    age: 40
}
let arr = ["Apple", "Banana", "Grapes", "Pineapple", "Cherry", person];
console.log(arr[5])

// Add or Remove elements
arr.push('orange');

arr.pop(); // Removes last element
arr.shift(); // Removes first element
arr.unshift("Orange"); // Add element to the first index
console.log(arr)

//NOTE: Push and POP are more performant thatn unshift and shift

// Looping an array

for (let i = 0; i < arr.length; i++) {
    console.log(arr[i])
}

let i = 0;
while (i < arr.length) {
    // console.log(arr[i]);
    i++;
}

const numbers = [1, 2, 3, 4, 5];
const nuwNumbers = numbers.map((item, index, array) => {
    // console.log(item, index, array);
})

const filteredNumbers = numbers.filter((item) => item > 3);

const dupNumbers = [1, 2, 3, 4, 5, 6, 5, 2, 6, 7];
const uniqNumbers = Array.from(new Set(dupNumbers));
console.log(uniqNumbers);


// ============================================================================
// 1. REMOVE DUPLICATES FROM SORTED ARRAY (LeetCode 26)
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Sorted array", "Remove duplicates in-place", "O(1) extra memory"
 *    - Metaphor: The Slow & Fast Writer ✍️ (Slow pointer `i` holds last unique rock.
 *      Fast pointer `j` scouts ahead. When scout finds a new rock, slow writer advances and copies it).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: If empty, return 0. Set `i = 0`.
 *    - Step 2: Loop `j` from 1 to N-1:
 *              * If `nums[i] !== nums[j]` -> advance `i++`, copy `nums[i] = nums[j]`.
 *    - Step 3: Return `i + 1` (the new length of unique elements).
 *
 * 3. THE APPROACH:
 *    - In-place two-pointer partition (Reader/Writer pattern).
 *
 * 4. TRADE-OFFS:
 *    - Set (`Array.from(new Set(nums))`): O(N) extra memory, not allowed by LeetCode 26!
 *    - In-Place Two Pointers: O(N) time, strict O(1) space!
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Input array must be SORTED. If unsorted, sort first or use Hash Set.
 *    - Returning `i` instead of `i + 1` (length is 1-indexed, `i` is 0-indexed).
 *
 * Complexity: Time O(N) | Space O(1) in-place
 */
const removeDuplicates = (nums: number[]) => {
    if (nums.length === 0) return { duplicateCount: 0, uniqueArray: [] };

    const originalLength = nums.length;
    let i = 0;

    for (let j = 1; j < nums.length; j++) {
        if (nums[i] !== nums[j]) {
            i++;
            nums[i] = nums[j]!;
        }
    }

    const uniqueCount = i + 1;
    const duplicateCount = originalLength - uniqueCount;

    // Chop dead tail rocks!
    nums.length = uniqueCount;

    return {
        duplicateCount,
        uniqueArray: nums
    };
};

console.log(removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 5, 7, 7, 7]));


const removDupes = (nums: number[]): number => {
    if (nums.length === 0) return 0;

    let i = 0;
    for (let j = 1; j < nums.length; j++) {
        if (nums[i] !== nums[j]) {
            i++;
            nums[i] = nums[j]!;
        }
    }
    return (i + 1);
}
console.log('Remove Dupes:', removDupes([0, 0, 1, 1, 1, 2, 2, 3, 3, 4, 5, 5, 7, 7, 7]))

// const nos = [5, 7, 3, 9, 1];
// const orderedNos = nos.sort((a, b) => (a - b));
// console.log(orderedNos)


// ============================================================================
// 2. TWO SUM (LeetCode 1)
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Two numbers add up to target" / "Find pair indices"
 *    - Metaphor: The Lost Half / Missing Lock Key 🔑 (For each number `x`, you need `target - x`.
 *      Look in your pocket map: "Did I pick up the missing key earlier?").
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Create `seen = new Map<number, number>()` (stores value -> index).
 *    - Step 2: Loop numbers: compute `complement = target - nums[i]`.
 *    - Step 3: If `seen.has(complement)`, return `[seen.get(complement)!, i]`.
 *    - Step 4: Else save current: `seen.set(nums[i], i)`.
 *
 * 3. THE APPROACH:
 *    - Hash Map trading O(N) space for O(N) linear time.
 *
 * 4. TRADE-OFFS:
 *    - Brute Force: Two nested loops O(N^2) time, O(1) space.
 *    - Hash Map: O(N) time, O(N) space (optimal when returning indices).
 *    - Two Pointers (left + right): O(N log N) sort time, O(1) space. Destroys original indices!
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Adding element to map BEFORE checking complement: if `target = 6` and `nums[i] = 3`,
 *      an element might pair with itself! (Must check complement first, then insert).
 *
 * Complexity: Time O(N) | Space O(N)
 */
const twoSum = (nums: number[], target: number) => {

    const seen = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i]!;

        if (seen.has(complement)) {
            return [seen.get(complement)!, i]
        }

        seen.set(nums[i]!, i)

    }

    return [];
}

console.log(twoSum([2, 11, 7, 15], 9));


// Frequency
// ["a", "b", "a", "c", "a"] --> a → 3 b → 1 c → 1

const frequency = (chars: string[]) => {
    const freq = new Map<string, number>();

    for (const ch of chars) {
        freq.set(ch, (freq.get(ch) ?? 0) + 1);
    }
    return freq;
}

// console.log(frequency(["a", "b", "a", "c", "a", "c"]))

// ============================================================================
// 3. PALINDROME CHECK (LeetCode 125)
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Reads same forwards and backwards" / "Mirrored string"
 *    - Metaphor: Converging Clapping Hands 👏 (One hand at start, one at end. Walk toward middle).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Initialize `left = 0, right = str.length - 1`.
 *    - Step 2: Loop `while (left < right)`:
 *              * If `s[left] !== s[right]`, return `false`.
 *              * `left++`, `right--`.
 *    - Step 3: Return `true`.
 *
 * 3. THE APPROACH:
 *    - Two pointers converging from opposite ends toward center.
 *
 * 4. TRADE-OFFS:
 *    - `s === s.split('').reverse().join('')`: Allocates 2 new strings and array (O(N) memory).
 *    - Two Pointers: Strict O(1) auxiliary space! Stops at first mismatch.
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Number input: convert to string first or use math modulo (`% 10` and `/ 10`).
 *    - Alpha-numeric filtering: LeetCode 125 requires skipping non-alphanumeric chars.
 *
 * Complexity: Time O(N) | Space O(1)
 */
const isPalindrome = (value: string | number): boolean => {
    const s = String(value)

    let left = 0;
    let right = s.length - 1;

    while (left < right) {

        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}

console.log(isPalindrome('madam'))
console.log(isPalindrome('madamm'))
console.log(isPalindrome(121))
console.log(isPalindrome(125))


// ============================================================================
// 4. FIXED-SIZE SLIDING WINDOW (Maximum Sum of Size K)
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Subarray of exact size K" / "Consecutive K elements max/min sum"
 *    - Metaphor: The Caterpillar 🐛 (One head stretches forward to eat new leaf;
 *      tail pulls forward to discard old leaf. Window size stays strictly K).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: `windowSum = 0, maxSum = -Infinity`.
 *    - Step 2: Loop `right` from 0 to N-1:
 *              * Add incoming: `windowSum += nums[right]`.
 *              * Once window reaches size K (`right >= k - 1`):
 *                1) Update `maxSum = Math.max(maxSum, windowSum)`.
 *                2) Subtract outgoing: `windowSum -= nums[right - k + 1]`.
 *
 * 3. THE APPROACH:
 *    - Reusing previous sum by subtracting departing element and adding entering element.
 *
 * 4. TRADE-OFFS:
 *    - Brute Force sum of every K slice: O(N * K) time.
 *    - Sliding Window: O(N) linear time, O(1) space!
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Initializing `maxSum = 0`: Fails when all array numbers are negative! Use `-Infinity`.
 *    - Off-by-one window check: `right >= k - 1`.
 *
 * Complexity: Time O(N) | Space O(1)
 */
const maxSum = (nums: number[], k: number): number => {

    let windowSum = 0;
    let maxSum = -Infinity;

    for (let right = 0; right < nums.length; right++) {
        // Add new element
        windowSum += nums[right]!;

        // Once window reaches size k
        if (right >= k - 1) {
            // Check maximum
            maxSum = Math.max(maxSum, windowSum);

            // Remove element leaving the window
            const left = right - k + 1;
            windowSum -= nums[left]!;
        }
    }
    return maxSum;
}


// ============================================================================
// 5. DYNAMIC SLIDING WINDOW (LeetCode 3: Longest Substring Without Repeating)
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Longest / Shortest substring satisfying condition" (no duplicates, at most K)
 *    - Metaphor: The Elastic Accordion 🪗 (Expand right pointer to explore;
 *      when invalid duplicate appears, shrink left pointer until valid again).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: `seen = new Set<string>()`, `left = 0, maxLength = 0`.
 *    - Step 2: Loop `right` from 0 to N-1:
 *              * While `seen.has(s[right])`: remove `s[left]` and advance `left++`.
 *              * Add `s[right]` to `seen`.
 *              * Update `maxLength = Math.max(maxLength, right - left + 1)`.
 *    - Step 3: Return `maxLength`.
 *
 * 3. THE APPROACH:
 *    - Variable-size sliding window with Set tracking current window state.
 *
 * 4. TRADE-OFFS:
 *    - Brute Force substrings: O(N^3) or O(N^2).
 *    - Dynamic Sliding Window: O(2N) = O(N) time! Each character visited by left and right at most once.
 *    - Map of char -> lastIndex can jump `left = map.get(char) + 1` directly (slight optimization).
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Forgetting the `while` loop when shrinking `left` (might need to shrink multiple chars).
 *    - Window length formula: `right - left + 1` (add 1 because indices are inclusive).
 *
 * Complexity: Time O(N) | Space O(min(N, alphabet))
 */
function lengthOfLongestSubstring(s: string): number {
    const seen = new Set<string>();

    let left = 0;
    let maxLength = 0;

    for (let right = 0; right < s.length; right++) {
        while (seen.has(s[right]!)) {
            seen.delete(s[left]!);
            left++;
        }

        seen.add(s[right]!);

        maxLength = Math.max(
            maxLength,
            right - left + 1
        );
    }

    return maxLength;
}