A single-button puzzle game built with HTML, CSS, and JS. There are 3 simple puzzle games with just a button and a light. See if you can figure them all out!





Solution:
Press the button once to start.
The light will turn green indicating that the game started.

Puzzle 1:
The light will turn either blue for a longer period of time or purple for a short period of time, then turn off, then turn green.
After the light turns off you are able to press the button without losing. 
If the light was purple, press the button for a short amount of time (orange). Purple = Quick Press
If the light was blue, press the button for a long amount of time (yellow). Blue = Long Press
For Example, if the sequence is blue purple blue, input a long press, then a short press, then a long press
The Puzzle will then repeat, adding another color to the sequence until the puzzle has been solved with a sequence of 5.

Puzzle 2:
The light will then turn red. Do not press the button.
The light will turn green after some time. When it turns green, press the button within 500ms.
The puzzle will repeat 5 times.

Puzzle 3:
The light will flash yellow, cyan, or magenta, then cycle through 3 colors.
Your job is to find the color that does not go into making the color the light flashed and press the button when it is in cycle.
For exanple, if the light flashes cyan and the cycle is blue, red, green, press the button when the color is red.
This repeats 5 times, then you win!
