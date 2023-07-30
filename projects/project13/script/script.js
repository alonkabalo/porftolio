var box = document.getElementById("calc-display");

// Function to display the pressed button value on the screen
function toScreen(x) {
  // Append the value of the pressed button to the display
  box.value += x;
  if (x === "C") {
    box.value = "";
  }
}

function answer() {
  // Retrieve the expression from the display
  x = box.value;
  x = eval(x);
  box.value = x;
}

function sqr() {
  x = box.value;
  x = eval(x * x);
  box.value = x;
}

// Function to remove the last digit or operator entered into the display
function backSpace() {
  var num = box.value;
  var len = num.length - 1;
  var newNum = num.substring(0, len);

  // Display the new string (number or expression) on the screen
  box.value = newNum;
}
