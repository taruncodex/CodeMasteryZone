
#include <iostream>
using namespace std;
 
int main()
{
    int a, b, c, d;

    // Taking input from the user
    cout << "Enter four numbers: ";
    cin >> a >> b >> c >> d;
 
    // checking if a is largest
    if (a >= b && a >= c && a >= d)
        cout << "Largest Number: " << a;
 
    // checking if b is largest
    else if (b >= a && b >= c && b >= d)
        cout << "Largest Number: " << b;
 
    // checking if c is largest
    else if (c >= a && c >= b && c >= d)
        cout << "Largest Number: " << c;
 
    // d is largest
    else
        cout << "Largest Number: " << d;
 
    return 0;
}