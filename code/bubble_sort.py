from typing import List, Any


def bubble_sort(arr: List[Any], reverse: bool = False) -> List[Any]:
    """
    Bubble Sort Algorithm.

    Sorts the list in-place using the bubble sort algorithm.

    Time Complexity: O(n^2) in worst and average cases, O(n) in best case (already sorted).
    Space Complexity: O(1) - sorts in-place.

    Note: This algorithm is primarily intended for educational purposes or very small datasets.
    For production use with larger datasets, consider using Python's built-in sort() or sorted().

    Args:
        arr: List of comparable elements. The list is modified in-place.
        reverse: If True, sort in descending order. If False (default), sort in ascending order.

    Returns:
        The same list (arr), sorted. Note that the input list is modified in-place.

    Example:
        >>> data = [64, 34, 25, 12, 22, 11, 90]
        >>> bubble_sort(data)
        [11, 12, 22, 25, 34, 64, 90]
        >>> bubble_sort(data, reverse=True)
        [90, 64, 34, 25, 22, 12, 11]
    """
    n = len(arr)

    # Traverse through all array elements
    for i in range(n):
        # Flag to optimize by detecting if array is already sorted
        swapped = False

        # Last i elements are already in place
        for j in range(0, n - i - 1):
            # Determine comparison direction based on 'reverse' flag
            should_swap = (arr[j] < arr[j + 1]) if reverse else (arr[j] > arr[j + 1])

            if should_swap:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True

        # If no swapping occurred, array is already sorted
        if not swapped:
            break

    return arr


# Example usage
if __name__ == "__main__":
    # Test case 1: Unsorted array
    test_array_1 = [64, 34, 25, 12, 22, 11, 90]
    print("Original array:", test_array_1)
    print("Sorted array (ascending):", bubble_sort(test_array_1.copy()))
    print("Sorted array (descending):", bubble_sort(test_array_1.copy(), reverse=True))

    print("\n" + "="*50 + "\n")

    # Test case 2: Already sorted array
    test_array_2 = [1, 2, 3, 4, 5]
    print("Already sorted array:", test_array_2)
    print("Sorted array (ascending):", bubble_sort(test_array_2.copy()))

    print("\n" + "="*50 + "\n")

    # Test case 3: Reverse sorted array
    test_array_3 = [9, 7, 5, 3, 1]
    print("Reverse sorted array:", test_array_3)
    print("Sorted array (ascending):", bubble_sort(test_array_3.copy()))

    print("\n" + "="*50 + "\n")

    # Test case 4: Array with duplicates
    test_array_4 = [5, 2, 8, 2, 9, 1, 5]
    print("Array with duplicates:", test_array_4)
    print("Sorted array (ascending):", bubble_sort(test_array_4.copy()))
