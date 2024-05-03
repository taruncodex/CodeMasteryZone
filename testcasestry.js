
// Test Framework:
//  Create a separate section or button for running tests. 
//  Users can click this button to execute the predefined tests against their function. 
//  You'll need to define the test cases and expected outputs.

function runTests() {
    // Test cases
    var testCases = [
        { input: [1, 3], expected: 2 },
        { input: [1, 2], expected: 1.5 }
    ];

    // Run tests
    for (var i = 0; i < testCases.length; i++) {
        var result = findMedianSortedArrays(...testCases[i].input);
        var expected = testCases[i].expected;
        if (result !== expected) {
            console.error("Test failed for input:", testCases[i].input);
            console.error("Expected:", expected, "but got:", result);
        } else {
            console.log("Test passed for input:", testCases[i].input);
        }
    }
}



// Step 5: Feedback Mechanism
function runTests() {
    var resultsArea = document.getElementById("results");
    resultsArea.innerHTML = ""; // Clear previous results

    // Test cases
    var testCases = [
        { input: [1, 3], expected: 2 },
        { input: [1, 2], expected: 1.5 }
    ];

    // Run tests
    for (var i = 0; i < testCases.length; i++) {
        var result = findMedianSortedArrays(...testCases[i].input);
        var expected = testCases[i].expected;
        var testResult = (result === expected) ? "Passed" : "Failed";
        var testInfo = "Input: " + JSON.stringify(testCases[i].input) + ", Expected: " + expected + ", Result: " + result + " - " + testResult;
        var testElement = document.createElement("div");
        testElement.textContent = testInfo;
        resultsArea.appendChild(testElement);
    }
}






