/**
 * ============================================================================
 * PREFIX SUM MASTER PATTERNS (LeetCode 303, 560)
 * ============================================================================
 */

// ============================================================================
// 1. RANGE SUM QUERY (LeetCode 303)
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Frequent range queries sum(L, R)" / "Cumulative sum"
 *    - Metaphor: Highway Mile Markers 🛣️ (Distance between exit 2 and 5 is marker[5] - marker[2]).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Create `prefix` array of size `N + 1` initialized to 0.
 *    - Step 2: Build cumulative sums: `prefix[i + 1] = prefix[i] + nums[i]`.
 *    - Step 3: Range sum for `[left, right]` is simply `prefix[right + 1] - prefix[left]`.
 *
 * 3. THE APPROACH:
 *    - Precomputation trades one-time O(N) setup for instant O(1) query response.
 *
 * 4. TRADE-OFFS:
 *    - Precomputation vs On-demand sum:
 *      * On-demand: O(1) build, O(N) per query.
 *      * Prefix sum: O(N) build, O(1) per query (1,000 queries run in nanoseconds!).
 *      * If array elements mutate frequently: use a Fenwick Tree / Segment Tree (O(log N) updates).
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Off-by-one errors: forgetting that `prefix` needs size `N + 1` with `prefix[0] = 0`.
 *
 * Complexity: Build O(N) | Query O(1) | Space O(N)
 */
export function buildPrefixSum(nums: number[]): number[] {
    const prefix = new Array<number>(nums.length + 1).fill(0);

    for (let i = 0; i < nums.length; i++) {
        prefix[i + 1] = prefix[i]! + nums[i]!;
    }
    return prefix;
}

export function queryRangeSum(prefix: number[], left: number, right: number): number {
    return prefix[right + 1]! - prefix[left]!;
}

// ============================================================================
// 2. SUBARRAY SUM EQUALS K (LeetCode 560)
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Continuous subarray sum equals target K" (especially with negative numbers!)
 *    - Metaphor: The Missing Ledger Piece 🧩 (If `currentSum - earlierSum === K`, then
 *      `earlierSum === currentSum - K`. Check our ledger map: how many times did we see that?).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Initialize `prefixCount = new Map<number, number>()`.
 *    - Step 2: CRITICAL: Seed with `prefixCount.set(0, 1)` (represents empty prefix before index 0).
 *    - Step 3: Accumulate running `sum`.
 *    - Step 4: Check if `sum - k` exists in map. If yes, add its count to answer.
 *    - Step 5: Record `sum` in map: `prefixCount.set(sum, (prefixCount.get(sum) ?? 0) + 1)`.
 *
 * 3. THE APPROACH:
 *    - Two Sum logic applied to Prefix Sums: $S_j - S_i = K \iff S_i = S_j - K$.
 *
 * 4. TRADE-OFFS:
 *    - Sliding Window vs Prefix Sum + Hash Map:
 *      * Sliding Window (Two Pointers) ONLY works when all numbers are strictly positive!
 *      * When numbers can be negative or zero, window monotonicity is broken.
 *      * Prefix Sum + Hash Map is the ONLY O(N) technique that handles negative numbers.
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Forgetting the base seed `prefixCount.set(0, 1)`:
 *      Any valid subarray that begins at index 0 (e.g. `[3]` when `k = 3`) will be missed!
 *
 * Complexity: Time O(N) | Space O(N)
 */
export function subarraySum(
    nums: number[],
    k: number
): number {
    const prefixCount = new Map<number, number>();

    // Base case: a sum of 0 occurred 1 time before any elements
    prefixCount.set(0, 1);

    let sum = 0;
    let count = 0;

    for (const num of nums) {
        sum += num;
        const needed = sum - k;

        if (prefixCount.has(needed)) {
            count += prefixCount.get(needed)!;
        }

        prefixCount.set(
            sum,
            (prefixCount.get(sum) ?? 0) + 1
        );
    }

    return count;
}

// Demo runs
const isDirectRun = process.argv[1]?.endsWith("prefix-sum.ts");
if (isDirectRun) {
    const nums = [2, 4, 1, 3, 5];
    const prefix = buildPrefixSum(nums);
    console.log("Prefix array:", prefix);
    console.log("Range sum [1..3] (4+1+3):", queryRangeSum(prefix, 1, 3)); // 8

    const subNums = [1, 2, 3];
    console.log("Subarrays with sum 3 in [1, 2, 3]:", subarraySum(subNums, 3)); // 2 ([1,2] and [3])
}