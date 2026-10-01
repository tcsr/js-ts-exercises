/**
 * ============================================================================
 * INTERVALS & POINTER MASTER PATTERNS (LeetCode 56, 876)
 * ============================================================================
 */

// ============================================================================
// 1. MERGE INTERVALS (LeetCode 56)
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Overlapping time ranges / meeting rooms / calendar conflicts"
 *    - Metaphor: The Calendar Meeting Merger 📅 (Sort meetings by start time;
 *      if current starts before previous ends, stretch the previous meeting!).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Sort intervals by START time: `intervals.sort((a, b) => a[0] - b[0])`.
 *    - Step 2: Initialize result with the first interval: `result = [intervals[0]]`.
 *    - Step 3: Loop through remaining intervals:
 *              * Overlap? `current.start <= last.end` -> `last.end = Math.max(last.end, current.end)`.
 *              * No overlap? Push `current` as a new separate interval into result.
 *
 * 3. THE APPROACH:
 *    - Greedy Interval Scheduling: Sorting by start time transforms a 2D problem into a 1D sweep.
 *
 * 4. TRADE-OFFS:
 *    - Sorting upfront takes O(N log N) time, but allows a simple single O(N) sweep.
 *    - Space: O(N) for output array.
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Forgetting to sort first! (Unsorted input like `[[2,6], [1,3]]` fails completely).
 *    - Completely contained intervals: `[1, 10]` and `[2, 3]` -> `last.end` must be `Math.max(10, 3) = 10`!
 *
 * Complexity: Time O(N log N) | Space O(N)
 */
export function mergeIntervals(
    intervals: number[][]
): number[][] {
    if (intervals.length === 0) {
        return [];
    }

    // Step 1: Sort by start time
    intervals.sort((a, b) => a[0]! - b[0]!);

    const result: number[][] = [intervals[0]!];

    // Step 2: Single-pass merge
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i]!;
        const last = result[result.length - 1]!;

        // Overlap detected: current starts before or when last ends
        if (current[0]! <= last[1]!) {
            last[1] = Math.max(last[1]!, current[1]!);
        } else {
            // No overlap: start new interval
            result.push(current);
        }
    }

    return result;
}

// ============================================================================
// 2. FAST & SLOW POINTERS (Tortoise & Hare - LeetCode 876)
// ============================================================================
/**
 * 1. HOW TO REMEMBER:
 *    - Trigger: "Find middle of linked list / Detect cycle (Floyd's algorithm)"
 *    - Metaphor: Tortoise and Hare 🐇🐢 (Hare runs 2 steps for every 1 step of tortoise.
 *      When hare hits the wall, tortoise is standing at exact 50% midpoint!).
 *
 * 2. STEPS TO FOLLOW:
 *    - Step 1: Initialize `slow = head` and `fast = head`.
 *    - Step 2: Loop while `fast !== null && fast.next !== null`:
 *              * `slow = slow.next` (1 step)
 *              * `fast = fast.next.next` (2 steps)
 *    - Step 3: Return `slow`.
 *
 * 3. THE APPROACH:
 *    - Two pointers moving at relative speeds (1x vs 2x).
 *
 * 4. TRADE-OFFS:
 *    - Two-Pass (count length N, then walk N/2) vs One-Pass (Tortoise & Hare):
 *      * Tortoise & Hare achieves single-pass O(N) time with strict O(1) space.
 *      * Eliminates need to cache or re-traverse nodes.
 *
 * 5. PITFALLS & EDGE CASES:
 *    - Even number of nodes: `[1, 2, 3, 4]` returns second middle node `3` (standard LeetCode).
 *    - Null check order: MUST check `fast !== null` before `fast.next !== null` to prevent crash!
 *
 * Complexity: Time O(N) | Space O(1)
 */
export class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val: number = 0, next: ListNode | null = null) {
        this.val = val;
        this.next = next;
    }
}

export function findMiddle(head: ListNode | null): ListNode | null {
    let slow = head;
    let fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow!.next;
        fast = fast.next.next;
    }

    return slow;
}

// Demo runs
const isDirectRun = process.argv[1]?.endsWith("intervals.ts");
if (isDirectRun) {
    const intervals = [[1, 3], [2, 6], [8, 10], [15, 18]];
    console.log("Merged Intervals:", mergeIntervals(intervals)); // [[1, 6], [8, 10], [15, 18]]

    // 1 -> 2 -> 3 -> 4 -> 5
    const head = new ListNode(1, new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))));
    console.log("Middle of list (value):", findMiddle(head)?.val); // 3
}