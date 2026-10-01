
// Merge Intervals, [ [1, 3],  [2, 6],  [8, 10],  [9, 12]]
// First Step — Sort --> [1,3] [2,6] [8,10] [9,12]
// previous = [1, 3], current  = [2, 6], Check: current.start <= previous.end, 2 <= 3, Yes → overlap.
// Merge:start = 1, end = max(3, 6) → [1, 6]
// previous = [1, 6], current  = [8, 10] Check: 8 <= 6, No., So keep [1,6] and start a new interval:[8,10]

function mergeIntervals(
    intervals: number[][]
): number[][] {

    if (intervals.length === 0) {
        return [];
    }

    intervals.sort((a, b) => a[0]! - b[0]!);

    const result: number[][] = [intervals[0]!];

    for (let i = 1; i < intervals.length; i++) {

        const current = intervals[i]!;
        const last = result[result.length - 1]!;

        // Overlap
        if (current[0]! <= last[1]!) {
            last[1] = Math.max(last[1]!, current[1]!);
        }

        // No overlap
        else {
            result.push(current);
        }
    }

    return result;
}

// Fast & Slow Pointers 🐇🐢
// 1 → 2 → 3 → 4 → 5  Start:slow = 1, fast = 1, Move: slow = 2 fast = 3 Move: slow = 3 fast = 5
// fast reaches the end. Therefore: slow = 3 So 3 is the middle.
class ListNode {
    val: number;
    next: ListNode | null;
    constructor(val: number = 0, next: ListNode | null = null) {
        this.val = val;
        this.next = next;
    }
}

function findMiddle(head: ListNode | null): ListNode | null {
    let slow = head;
    let fast = head;

    while (fast !== null && fast.next !== null) {
        slow = slow!.next;
        fast = fast.next.next;
    }

    return slow;
}