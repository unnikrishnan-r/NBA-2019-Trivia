$(document).ready(function() {
  var timerMessage;
  var remainingSeconds = 30;
  var currentQuestionNumber = 0;
  var countDown;

  var correctAnswerCounter = 0;

  var gameObject = {};

  /* Function that dynamically add a "Start" button to page and defines a onclick event on the same.
       When clicked, it invokes readQuestionFile() function.
    */
  function showStartButton() {
    console.log("Starting Show Button function");
    $(".container").append(
      $("<div>", {
        class: "row justify-content-md-center",
        id: "startButton"
      })
    );

    $("#startButton").append(
      $("<div>", {
        class: "col-xs-3 btn btn-primary btn-lg mt-3",
        text: "PLAY QUIZ",
        id: "startBtn"
      })
    );

    $("#startBtn").on("click", function() {
      console.log("Clicked Start Button");
      //   readQuestionFile();
      startGame();
    });
  }

  //   Function to read a JSON file from repository. Once the file is read it invokes startGame() function
  //   by passing the JSON content from the file.
  function readQuestionFile() {
    console.log("Read Started");
    return fetch("assets/javascript/questions.json")
      .then(function(resp) {
        console.log("Read Completed");
        return resp.json();
      })
      .then(function(data) {
        console.log("Displaying Response of Fetch : ");
        console.log(data);
        // startGame(data);
        return data;
      });
  }

  /*This function starts the game by performing below
  1. Removes the start button from the page
  2. Copies JSON data to a global object
  3. Calls createQuestionHtmlElement() to create placeholders for questions, choices and timer message
  4. Calls askQuestion() to ask the first question
*/
  function startGame() {
    readQuestionFile().then(function(gameQuestions) {
      console.log("Displaying Game Data :" + gameQuestions);
      console.log(gameQuestions);
      console.log(Object.keys(gameQuestions));
      $("#startButton").remove();
      gameObject = gameQuestions;
      currentQuestionNumber = 1;
      createQuestionHtmlElement();
      askQuestion(gameQuestions.question1);
    });
  }

  /*Creates placeholders for:
    1. Timer message
    2. Question
    3. Choices
  */
  function createQuestionHtmlElement() {
    $(".container").append(
      $("<div>", {
        class: "row justify-content-md-center questionRow"
      })
    );

    $(".questionRow").append(
      $("<div>", {
        id: "questionText",
        class: "questionFont"
      })
    );

    $(".container").append(
      $("<div>", {
        class: "row justify-content-md-center choiceRow"
      })
    );

    $(".choiceRow").append(
      $("<div>", {
        id: "choiceList"
      })
    );
  }

  /*Accepts the question data as argument and performs the below:
     1. Display the question on the screen
     2. Display the choices on the screen
     3. Define onclick event on the choices. When clicked it invokes processResult() by passing the value of the choice clicked
     4. Display initial timer message
     5. Once question and choices are displayed, initiate countdown timer.
  */
  function askQuestion(question) {
    console.log(question.question);

    remainingSeconds = 30;
    showScoreBoard(remainingSeconds);

    $("#questionText").text(question.question);

    var choiceArray = Object.values(question.choices);

    console.log(choiceArray);
    for (var i = 0; i < choiceArray.length; i++) {
      $("#choiceList").append(
        $("<div>", {
          class: "choiceItemBox justify-content-md-center"
        }).append(
          $("<p>", {
            class: "choiceItem justify-content-md-center questionFont",
            text: choiceArray[i],
            cnbr: choiceArray[i]
          })
        )
      );
    }
    $(".choiceItem").on("click", function() {
      console.log($(this).attr("cnbr"));
      processResult(currentQuestionNumber, $(this).attr("cnbr"), false);
    });

    startCountDown();
  }

  function showScoreBoard(remainingSeconds) {
    timerMessage = "00:" + remainingSeconds;
    if (remainingSeconds > 9) {
      timerMessage = "00:" + remainingSeconds;
    } else {
      timerMessage = "00:0" + remainingSeconds;
    }
    $(".clockText").text(timerMessage);

    $(".questionNumberText").text(currentQuestionNumber);
    $(".remainigQuestionsText").text(
      Object.keys(gameObject).length - currentQuestionNumber
    );
    $(".scoreText").text(
      correctAnswerCounter + "/" + Object.keys(gameObject).length
    );
  }

  //Function that serves the need for a countdown timer. When time runs out, processResult() is called using timedOut arg
  function startCountDown() {
    countDown = setInterval(function() {
      remainingSeconds--;

      if (remainingSeconds > 9) {
        timerMessage = "00:" + remainingSeconds;
      } else {
        timerMessage = "00:0" + remainingSeconds;
      }
      $(".clockText").text(timerMessage);

      if (remainingSeconds <= 0) {
        processResult(currentQuestionNumber, null, true);
        console.log("Timer Ended");
      }
    }, 1000);
  }

  /*Function process the result. This can be invoked when clock runs out or user clics a choice. 
  Accepted arguments are current question number, selected answer, boolean indicating a timeout
  Below are performed
  1. Clear the setInterval so that count down stops
  2. Remove question and Choice blocks
  3. Setup gameMessage (Out of Time, Correct, Not correct etc)
  4. Increment counters (Unanswered, Correct Answer, Incorrect Answer etc)
  5. Show gameMessage and Correct answer on screen
  6. If more questions are left invoke waitAndAskNextQuestion()
  7. If it was the last question, display results
  */
  function processResult(currentQuestionNumber, selectedAnswer, timedOut) {
    clearInterval(countDown);

    $(".choiceItem").off("click");

    if (
      gameObject["question" + currentQuestionNumber].answer === selectedAnswer
    ) {
      console.log("Correct Choice");
      correctAnswerCounter++;
      console.log(selectedAnswer);
      $('[cnbr="' + selectedAnswer + '"]')
        .parent()
        .addClass("right");
    } else {
      console.log("InCorrect Choice");
      $('[cnbr="' + selectedAnswer + '"]')
        .parent()
        .addClass("wrong");

      $(
        '[cnbr="' + gameObject["question" + currentQuestionNumber].answer + '"]'
      )
        .parent()
        .addClass("right");
    }

    if (currentQuestionNumber < Object.keys(gameObject).length) {
      waitAndAskNextQuestion();
    } else {
      console.log("Correct Answer : " + correctAnswerCounter);
    }

    showScoreBoard(remainingSeconds);
  }

  /* This function handles the waiting before the next question is shown on screen using setTimeOut
  It then increments the question number, removes gameMessage and correct answer of previous question.
  Then creates placeholders for next question and choices and finally invokes askQuestion()
  */

  function waitAndAskNextQuestion() {
    setTimeout(function() {
      console.log("Going to ask Next Q");
      currentQuestionNumber++;
      console.log(gameObject["question" + currentQuestionNumber]);
      //   $(".questionFont").remove();
      $(".choiceItemBox").remove();
      askQuestion(gameObject["question" + currentQuestionNumber]);
    }, 2000);
  }

  showStartButton();
});
