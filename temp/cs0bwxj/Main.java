import java.util.Scanner;

public class Main {
    // Function to find the maximum element in the array with minimum number of comparisons
    public static int findMax(int[] arr, int start, int end) {
        int mid, max1, max2;
  
        if (start == end) // If only one element is present in the array
            return arr[start];
        if (end == start + 1) { // If only two elements are present
            return arr[start] > arr[end] ? arr[start] : arr[end];
        }
  
        // If more than two elements are present, divide and conquer
        mid = (start + end) / 2;
        max1 = findMax(arr, start, mid); // Recursively find max in the first half
        max2 = findMax(arr, mid + 1, end); // Recursively find max in the second half
  
        return Math.max(max1, max2); // Return the maximum of the two halves
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = 5; // Assuming the array size to be 5
        int[] arr = new int[n];
        
        for (int i = 0; i < n; i++) {
            arr[i] = scanner.nextInt(); // Input the elements of the array
        }
  
        int maxElement = findMax(arr, 0, n - 1); // Find the maximum element recursively
  
        System.out.println(maxElement);
    }
}
