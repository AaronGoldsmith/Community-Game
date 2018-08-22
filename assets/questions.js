// VARIABLES
var database = firebase.database()
var question = '';

database.ref("upcomingQs").on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    questionsArray.push(childSnapshot.val())
});

// Temporary question array for testing - this should be done firebase-side
var questionsArray = [
    {q: 'Is this an example question?', up: 0, down: 0, upvoted: false, downvoted: false },
    {q: 'Is this the second example question?', up: 0, down: 0, upvoted: false, downvoted: false },
    {q: 'More questions so you can actually have time to vote on some of them?', up: 0, down: 0, upvoted: false, downvoted: false },
    {q: 'blah blah blah blah blah?', up: 0, down: 0, upvoted: false, downvoted: false }
];
function questionDflt(question){
    return {q:question,up:0,down:0,upvoted:false,downvoted:false}
}

var active = [];

// Timer
var timerInterval;
var timerActive = false;
var checkInterval = window.setInterval(checkQuestions, 10000);
var timer = {
    time: 16,

    reset: function() {
        timer.time = 16;
    },

    start: function() {
        if (!timerActive) {
            timerInterval = setInterval(timer.countDown, 1000);
            timerActive = true;
        }
    },

    countDown: function() {
        timer.time--;
        $('#timer').text(`${timer.time} seconds remaining.`)
        if (timer.time <= 0) {
            timer.stop();
            setTimeout(function(){ next(); }, 1500)
        }
    },

    stop: function() {
        clearInterval(timerInterval);
        timerActive = false;
        $('#timer').text('');
    }
};

// FUNCTIONS
 
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
};

// Restarts the game and shows p5 + buttons if it sees a question
// This is why next() runs even though the document.ready event was disabled (don't know why it was disabled)
function checkQuestions() {

    // Commenting this out because it's breaking this function
    
    // check for questions in db?
    
    if (!timerActive && questionsArray.length > 0) {
        next();
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
        $('#active').text(active[0].q);
        timer.start();
    }
    else {
        $('#active').empty();
        timer.stop();
        $('#sketch-box').hide();
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
        console.log('You already upvoted.');
        return false;
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
        console.log('You already downvoted.');
        return false;
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
    
    // For testing only - pushes to array
    var newQ  = {q: question, up: 0, down: 0, upvoted: false, downvoted:false}
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
addQuestion(); 



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
    var queryURL = "https://www.reddit.com/r/"+ subreddit +"/top/.json";
    //gets a large chunk of data about a question

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        var children = response.data.children;
        for(var i = 0;i<maxQs;i++){
        //     // console.log(children[i].data);
            var ID = children[i].data.id
            var title = children[i].data.title;
            var aut = children[i].data.author
            var date = children[i].data.created_utc
        //     questions.push(child.data);
            var obj = {
                    question: formatDAE(title),
                    agrees: 0,
                    id: ID,
                    disagrees: 0,
                    author: aut,
                    created: date
                }
                if(!database.ref("/upcomingQs").hasChild(ID).exists()){
                    firebase.database().ref("/upcomingQs/"+ID).push(obj);
                }

            database.ref("/upcomingQs").child(ID).on('value', function(snapshot){
                console.log("checking for 'historical' questions")
                if(!snapshot.exists()){
                    console.log("found " + ID)
                    }
        
                });
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

database.ref("historical").on("child_added",function (snapshot){
    console.log("added to historical")
})

 database.ref("activeQ").on('child_added', function (snapshot) {
     var message = snapshot.val();

     // questionsArray.push(message);
     $('#active').html(message.q);
 });
// db triggers
$(document).ready(function(){
    getRedditData("DoesAnybodyElse",10);

  
    
})
