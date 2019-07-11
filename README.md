# NBA-2019-Trivia
Javascript based NBA 2019 trivia

## Demo of the Game!!

<img src="./assets/javascript/gamedemo.gif"/>

## Game Rules
This is a simple quiz based on NBA. For every question, player gets 10 seconds to answer. If a wrong answer is chosen, it is highlighted in RED and the correct answer highlighted in Green.

If the player runs out of time, the correct answer is highlighted in Green.

The game automatically moves to next question with no inputs from the user.

## Architecture

The application utilizes an external JSON file that holds the questions, choices and the correct answer.
On starting the game, the file is read and consumed to an object for further use in the application.

Further it uses various functions:


| Sl No |  Function Name | Arguments |Return | Description |
|--|--|--|--|--|
|  1|showStartButton  |None | None|Shows a start game function on the page. When the button is clicked, it invokes startGame()|
|2| startGame|None|None|Reads a external JSON file which holds the questions, creates HTML placeholders and then asks the question on the screen |
|3|readQuestionFile|None|JSON object| Reads the external JSON file to get questions|
|4|createQuestionHtmlElement|None|None|Creates placeholder HTML elements for Questions, Choices|
|5|askQuestion|None|None|Shows the question and choices on the screen, shows initial scoreboard and initiates count down|
|6|showScoreBoard|None|None|Shows Question Number, Remaining Questions, Score and Timer|
|7|startCountDown|None|None|Timer countdown by 1 sec|
|8|processResult|current QNo, selected Answer, timedOut (boolean)|Handles correct, incorrect and timed out scenarios|
|9|waitAndAskNextQuestion|None|None| Wait for n seconds before asking next question, without any user inputs|
|10|gameOver|None|None|Handles end of all questions|

 