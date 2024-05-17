import java.util.Scanner;

public class Main {
    // Function to find the maximum element in an array
    public static int findMaximum(int[] A) {
        if (A.length <= 0) return -1;  // Return a default error value if array is empty

        int maxElement = A[0];  // Start with the first element as the maximum
        for (int i = 1; i < A.length; i++) {  // Loop through the array starting from the second element
            if (A[i] > maxElement) {
                maxElement = A[i];  // Update maxElement if a larger element is found
            }
        }
        return maxElement;  // Return the maximum element found
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);  // Create a Scanner object for taking input from the user
       
        int n = 5;
     

        int[] A = new int[n];  // Declare the array with the given size

       
        for(int i = 0 ; i < n ; i++) {
            A[i] = scanner.nextInt();  // Read each element of the array from the user
        }

        int maxElement = findMaximum(A);  // Find the maximum element
        System.out.println( maxElement);  // Display the result

        scanner.close();  // Close the scanner object
    }
}