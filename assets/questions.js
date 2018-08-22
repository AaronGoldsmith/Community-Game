// VARIABLES
var database = firebase.database()
var question = '';

database.ref("upcomingQs").on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    questionsArray.push(childSnapshot.val())
});

// Temporary question array for testing - this should be done firebase-side
var questionsArray = [
    {q: 'Are you ready to play?', up: 0, down: 0, upvoted: false, downvoted: false },
];

var active = [];

// Timer
var timerInterval;
var timerActive = false;
// var checkInterval = window.setInterval(checkQuestions, 10000);
var timer = {
    time: 16,

    reset: function() {
        timer.time = 16;
        //FIREBASED-RELATED. Set the timeLeft to be the same as timer.time
        updateToFireBase();
    },

    start: function() {
        if (!timerActive) {
            //Note. In countdown, I added in events that updates timeLeft to be same as timer.time
            timerInterval = setInterval(timer.countDown, 1000);
            timerActive = true;
        }
    },

    countDown: function() {
        timer.time--;
        $('#timer').text(`${timer.time} seconds remaining.`)
        //FIREBASED-RELATED. Set the timeLeft to be the same as timer.time
        updateToFireBase();
        if (timer.time <= 0) {
            timer.stop();
            setTimeout(function(){ next(); }, 1500)
            //FIREBASED-RELATED. Set the timeLeft to be the same as timer.time
            updateToFireBase();
        }
    },

    stop: function() {
        clearInterval(timerInterval);
        timerActive = false;
        $('#timer').text('');
    }
};

// FUNCTIONS
//FIREBASE-RELATED. Completely new from what's found in timer.html
// updates timeLeft to be the same as timer.time
var updateToFireBase = function(){
    database.ref("/activeQ").set({
        timeLeft: timer.time
    })
}; 

function addQuestion() {
    $('#tba-container').empty();
    for (var i = 0; i < questionsArray.length; i++) {
        // Create single row+column for new question
        var newRow = $('<tr>');
        var rateCol = $('<td class="rating">');
        var voteCol = $('<td class="votes">');
        var questCol = $('<td class="question">');

        // Rating variables
        rateCol.text(questionsArray[i].up - questionsArray[i].down);

        // Create upvote+downvote arrows
        var up = $('<i class="upvote fas fa-chevron-up"></i>');
        var down = $('<i class="downvote fas fa-chevron-down"></i>');

        if (questionsArray[i].upvoted) {
            up.attr('data-vote', 'upvoted');
            down.attr('data-vote', 'none');
        }
        else if (questionsArray[i].downvoted) {
            up.attr('data-vote',  'none');
            down.attr('data-vote', 'downvoted');
        }
        else {
            up.attr('data-vote', 'none');
            down.attr('data-vote', 'none');
        }

        // Arrow IDs based on the index number
        // Allows upvote/downvotes to work without one arrow affecting every question's rating
        // I'm not sure how to implement this with firebase
        tempID = i; 
        up.attr('id', `up-${tempID}`);
        down.attr('id', `down-${tempID}`);
        rateCol.attr('id', `rating-${tempID}`);

        // Append things to table
        voteCol.append(up);
        voteCol.append(down);
        questCol.append(questionsArray[i].q);
        newRow.append(rateCol);
        newRow.append(voteCol);
        newRow.append(questCol);
        $('#tba-container').append(newRow);
    }
};

// This is a little unnecessary but adds delay after page load
function loadQuestion() {
    setTimeout(function(){ next(); }, 1500);
    if(questionsArray.length<=4){
        getRedditData("DoesAnybodyElse",4);

    }
};


// Restarts the game and shows p5 + buttons if it sees a question
// This is why next() runs even though the document.ready event was disabled (don't know why it was disabled)
function checkQuestions() {

    // Commenting this out because it's breaking this function
    
    // check for questions in db?
    if (!timerActive && questionsArray.length > 0) {
        next();
        if(questionsArray.length<=4){
            getRedditData("DoesAnybodyElse");
        }
        $('#sketch-box').show();
        $('.game-buttons').show();
    }
};

// Gets next question and restarts timer if there's another  question
// Hides the p5 and buttons if there's no question
function next() {
    timer.reset();

    if (questionsArray.length > 0) {
        active.shift();
        active.push(questionsArray.shift());
        addQuestion();
        $('#active').html(active[0].q);
        timer.start();
    }
    else if(questionsArray.length <=5){
        getRedditData("DoesAnybodyElse");
    }
    else {
        $('#active').empty();
        timer.stop();
        $('#sketch-box').hide();
        $('.game-buttons').click()
        $('.game-buttons button').removeClass("btn-danger")
        $('.game-buttons').hide();
    }    
};


function updateVote(index) {
    $(`#rating-${index}`).text(questionsArray[index].up - questionsArray[index].down);
};

// EVENTS

// Event that retrieves from database and then calls function to update DOM

// User upvotes a question
$(document).on('click', '.upvote', function() {
    // Index to use for local array for testing
    var index = (this.id).split('-').slice(-1);
    
    var upElem = $(`#up-${index}`);
    var downElem = $(`#down-${index}`);

    var upState = upElem.attr('data-vote');
    var downState = downElem.attr('data-vote');

    if (upState === 'upvoted') {
        console.log('You removed your upvote.');
        upElem.attr('data-vote', 'none');
        downElem.attr('data-vote', 'none');

        questionsArray[index].up--;
        questionsArray[index].upvoted = false;
    }
    else if (downState === 'downvoted') {
        console.log('You changed your vote.');
        upElem.attr('data-vote', 'upvoted');
        downElem.attr('data-vote', 'none');
        
        questionsArray[index].up++;
        questionsArray[index].down--;
        questionsArray[index].upvoted = true;
        questionsArray[index].downvoted = false;
    }
    else {
        upElem.attr('data-vote', 'upvoted');
        downElem.attr('data-vote', 'none');

        questionsArray[index].up++;
        questionsArray[index].upvoted = true;
        questionsArray[index].downvoted = false;
    }  

    // firebase - not sure how this works with selecting the specific question
    // upVotes++;
    // db.ref().set({
    //     up: upVotes
    // })

    updateVote(index);
    questionsArray.sort(function(a, b) {
        if ((a.up - a.down) > (b.up - b.down)) return -1;
        if ((a.up - a.down) < (b.up - b.down)) return 1; 
    })
    addQuestion();
    console.log(questionsArray);
    console.log(`#${this.id} Upvoted!`);
});

// User downvotes a question
$(document).on('click', `.downvote`, function() {
    // Index to use for local array for testing
    var index = (this.id).split('-').slice(-1);

    var upElem = $(`#up-${index}`);
    var downElem = $(`#down-${index}`);

    var upState = upElem.attr('data-vote');
    var downState = downElem.attr('data-vote');

    if (downState === 'downvoted') {
        console.log('You removed your downvote.');
        upElem.attr('data-vote', 'none');
        downElem.attr('data-vote', 'none');
        
        questionsArray[index].down--;
        questionsArray[index].downvoted = false;
    }
    else if (upState === 'upvoted') {
        console.log('You changed your vote.');
        upElem.attr('data-vote', 'none');
        downElem.attr('data-vote', 'downvoted');
        
        questionsArray[index].up--;
        questionsArray[index].down++;
        questionsArray[index].upvoted = false;
        questionsArray[index].downvoted = true;
    }
    else {
        downElem.attr('data-vote', 'downvoted');
        upElem.attr('data-vote', 'none');

        questionsArray[index].down++;
        questionsArray[index].upvoted = false;
        questionsArray[index].downvoted = true;
    }

    updateVote(index);
    questionsArray.sort(function(a, b) {
        if ((a.up - a.down) > (b.up - b.down)) return -1;
        if ((a.up - a.down) < (b.up - b.down)) return 1; 
    })
    addQuestion();
    console.log(questionsArray);
    console.log(`#${this.id} Downvoted!`);
});

// User submits a question
$('#submit').on('click', function() {
    event.preventDefault();
    var question = $('#question-input').val().trim();
    
    var newQ  = {q: question, up: 0, down: 0, upvoted: false, id: Math.random()*1000, downvoted:false}

    database.ref("upcomingQs").push(newQ);
    // Later this function should be called in the snapshot event instead of the click
    addQuestion();

    $('#question-input').val('');
    // debugging 
    if(firebase.auth().currentUser){
        console.log("you are signed in")
    }
});

// Starting the "game"
$(document).ready(loadQuestion);

// Updating the DOM with the sample questions from the array



//          ~~~ PARSE TITLES ~~~
//
function formatCMV( redditTitle ){  
    if(redditTitle.substring(0,4) === "CMV:"){ 
        var questionPart = redditTitle.substring(5,redditTitle.length)
        return "Do you think " + questionPart;
    }
    return false;
 }

function formatDAE( redditTitle ){  
    if(redditTitle.substring(0,3) === "DAE"){ 
        var questionPart = redditTitle.substring(4,redditTitle.length)
        return "Do you " + questionPart;
    }
    return false;
 }

 // objects for ajax
 function QuestionObject(q,up,down,aut,date){
    let question = {
        _question: q,
        upvotes: up,        // agree
        downvotes: down,    // disagree
        author: aut,        // author or user
        date: date          // date posted
    }
  return question;
}

function getRedditData(subreddit,maxQs){
    var queryURL = "https://www.reddit.com/r/"+ subreddit +"/top/.json?t=year";
    //gets a large chunk of data about a question
    database.ref("/upcomingQs").removeValue()

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        var children = response.data.children;
        for(var i = 0;i<children.length&&i<maxQs;i++){

        //     // console.log(children[i].data);
            var ID = children[i].data.id
            var title = children[i].data.title;
            var aut = children[i].data.author
            var date = children[i].data.created_utc
        //     questions.push(child.data);
            var obj = {
                    q: formatDAE(title),
                    up: 0,
                    id: ID,
                    down: 0,
                    upvoted: false,
                    downvoted: false,
                    // author: aut,
                    // created: date
                }
                console.log(obj)
            database.ref("upcomingQs").push(obj);


            }
        
    })

   
}


// PRE: a json data object consisting 
//      of a single question
function extractData(Data){
        // var title = Data.title;
        var formattedTitle = formatDAE(Data.title);
        var author = Data.author;
        // var ID = Data.id;
        var creation = Data.created_utc;
        return QuestionObject(formattedTitle,0,0,author,creation)
}


     // questionsArray.push(message);
    
// db triggers
$(document).ready(function(){
    addQuestion(); 
    // getRedditData("DoesAnybodyElse");
<<<<<<< HEAD
});
=======
});
>>>>>>> e68da4f5cc501856bc9fbe026ab77906ec44bb8d
