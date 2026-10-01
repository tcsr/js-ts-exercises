/**
 * ============================================================================
 * BINARY SEARCH MASTER PATTERNS (LeetCode 704, 34, 35)
 * 
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Sorted array" / "Search in O(log N)" / "Find boundary or minimum that satisfies condition"
 *    - Metaphor: The Chopping Board 🔪 (Open in exact middle, throw away half, repeat).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Set pointers: `left = 0, right = nums.length - 1`.
 *    - Step 2: Loop `while (left <= right)`:
 *              `mid = left + Math.floor((right - left) / 2)` (prevents integer overflow!).
 *    - Step 3: Compare `nums[mid]` with `target`:
 *              * Equal -> Found! (Or save `ans = mid` and keep searching for boundary).
 *              * `nums[mid] < target` -> Eliminate left: `left = mid + 1`.
 *              * `nums[mid] > target` -> Eliminate right: `right = mid - 1`.
 *    - Step 4: Return index or `-1` if search space exhausted.
 *
 * 3. THE APPROACH:
 *    - Search within a monotonic (sorted) search space by eliminating 50% each iteration.
 *
 * 4. TRADE-OFFS:
 *    - Binary Search vs Linear Search:
 *      * Linear Search: O(N) time. Works on unsorted data.
 *      * Binary Search: O(log N) time, O(1) space. Requires sorted array (O(N log N) sort first).
 *    - Midpoint calculation:
 *      * `(left + right) / 2` can overflow 32-bit integers in high-scale systems.
 *      * `left + Math.floor((right - left) / 2)` is numerically safe.
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Off-by-one infinite loop: forgetting `+ 1` or `- 1` (`left = mid` instead of `mid + 1`).
 *    - Loop condition: `left <= right` when `right = n - 1`; `left < right` when `right = n`.
 *    - Handling duplicates: simple binary search returns any index; first/last requires continuing search.
 * ============================================================================
 */

// ============================================================================
// 1. Basic Binary Search (LeetCode 704)
// Time Complexity : O(log n)
// Space Complexity: O(1)
// ============================================================================
export function binarySearch(
    nums: number[],
    target: number
): number {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);

        if (nums[mid] === target) {
            return mid;
        }

        if (nums[mid]! < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

// ============================================================================
// 2. Advanced Binary Search: First / Last Occurrence & Bounds (LeetCode 34, 35)
// ============================================================================
export type SearchMode =
    | "any"
    | "first"
    | "last"
    | "lowerBound"
    | "upperBound";

export function binarySearchAdv(
    nums: number[],
    target: number,
    mode: SearchMode = "any"
): number {
    let left = 0;
    let right = nums.length - 1;
    let answer = -1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);

        if (nums[mid]! === target) {
            // Any occurrence
            if (mode === "any") {
                return mid;
            }

            // First occurrence → save answer, continue searching LEFT half
            if (mode === "first") {
                answer = mid;
                right = mid - 1;
            }
            // Last occurrence → save answer, continue searching RIGHT half
            else if (mode === "last") {
                answer = mid;
                left = mid + 1;
            }
            // Lower/upper bound variations
            else {
                answer = mid;
                if (mode === "lowerBound") {
                    right = mid - 1;
                } else {
                    left = mid + 1;
                }
            }
        } else if (nums[mid]! < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return answer;
}

// Demo runs
const isDirectRun = process.argv[1]?.endsWith("binary-search.ts");
if (isDirectRun) {
    const sortedNums = [1, 3, 5, 7, 9, 11, 13];
    console.log("Binary Search for 11:", binarySearch(sortedNums, 11)); // 5

    const dupNums = [1, 2, 2, 2, 3, 4];
    console.log("First occurrence of 2:", binarySearchAdv(dupNums, 2, "first")); // 1
    console.log("Last occurrence of 2 :", binarySearchAdv(dupNums, 2, "last"));  // 3
}