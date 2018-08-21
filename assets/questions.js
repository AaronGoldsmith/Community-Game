// VARIABLES
var question = '';
var db = firebase.database();

// Temporary question array for testing - this should be done firebase-side
var questionsArray = [
    {q: 'Is this an example question?', up: 0, down: 0, upvoted: false, downvoted: false },
    {q: 'Is this the second example question?', up: 0, down: 0, upvoted: false, downvoted: false },
    {q: 'More questions so you can actually have time to vote on some of them?', up: 0, down: 0, upvoted: false, downvoted: false },
    {q: 'blah blah blah blah blah?', up: 0, down: 0, upvoted: false, downvoted: false }
];

function fillQuestionArray(){
    var rootRef = db.ref("upcomingQs");
    rootRef.on("value")
    .then(function(snapshot) {
        var key = snapshot.key; // null
        var childKey = snapshot.child("/upcomingQs").key
    });
    questionsArray.push(key[childKey]);
    console.log(questiosnArray);
}
var active = [];

// Timer
var timerInterval;
var timerActive = false;
// var checkInterval = window.setInterval(checkQuestions, 10000);
var timer = {
    time: 16,

    reset: function() {
        timer.time = 16;
    },

    start: function() {
        if (!timerActive) {
            timerInterval = setInterval(timer.countDown, 1000);
            timerActive = true;
            // $('#timer').text('');
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
// This is breaking ratings when the questions are redone
// Need to divide it up     
function addQuestion() {
    $('#tba-container').empty();
    for (var i = 0; i < questionsArray.length; i++) {
        // Create single row+column for new question
        var newRow = $('<tr>');
        var newCol = $('<td>');
        var newQ = $('<div class="question">');

        // Rating variables
        var rating = $('<div class="rating">');
        rating.text(questionsArray[i].up - questionsArray[i].down);

        // Create upvote+downvote arrows
        var up = $('<i class="upvote fas fa-chevron-up"></i>');
        var down = $('<i class="downvote fas fa-chevron-down"></i>');
        var arrows = $('<div class="votes">');

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
        rating.attr('id', `rating-${tempID}`);

        // Append things
        arrows.append(up);
        arrows.append(down);
        newQ.append(questionsArray[i].q);
        newCol.append(newQ);
        newRow.append(newCol);
        newCol.prepend(arrows);
        newCol.prepend(rating);
        $('#tba-container').append(newRow);
    }
};

// This is a little unnecessary but adds delay after page load




// not clear what this function does
function next() {
    timer.reset();

    if (questionsArray.length > 0) {
        active.shift();
        active.push(questionsArray.shift());
        addQuestion();
        $('#active').text(active[0].q);
        // timer.reset();
        timer.start();
    }
    else {
        $('#active').empty();
        // timer.reset();
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
    console.log(`#${this.id} Downvoted!`);
});

// User submits a question
$('#submit').on('click', function() {
    event.preventDefault();
    var question = $('#question-input').val().trim();
    var upVotes = 0;
    var downVotes = 0;
    
    // For testing only - pushes to array
    var newQ  = {q: question, up: upVotes, down: downVotes}
    questionsArray.push(newQ);
    // Later this function should be called in the snapshot event instead of the click
    addQuestion();

    // For actual - push to database
    // db.ref().push({
    //     q: question,
    //     up: upVotes,
    //     down: downVotes
    // });

    $('#question-input').val('');
    // debugging 
    if(firebase.auth().currentUser){
        console.log("you are signed in")
    }
});

// Starting the "game"
// $(document).ready(loadQuestion);

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


// db triggers
$(document).ready(function(){
    
    db = firebase.database().ref();

    db.child("upcomingQs").on("child_added",function(snapshot){
       
    });
   db.child("historical").on("child_added",function (snapshot){
       console.log("added to historical")
   })

    db.child("activeQ").on('child_added', function (snapshot) {
        var message = snapshot.val();
        $('#active').html(message.question);
    });
    

    addQuestion(); 
    getRedditData("DoesAnybodyElse");



})
function getRedditData(subreddit){
    var queryURL = "https://www.reddit.com/r/"+ subreddit +"/top/.json";
    //gets a large chunk of data about a question
    db = firebase.database();
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        var children = response.data.children;
        for(var i = 0;i<children.length;i++){
        //     // console.log(children[i].data);
            var ID = children[i].data.id
            var title = children[i].data.title;
            var aut = children[i].data.author
            var date = children[i].data.created_utc
           
            db.ref("/upcomingQs").push( {
                question: formatDAE(title),
                agrees: 0,
                id: ID,
                disagrees: 0,
                author: aut,
                created: date
            });
        }
    }) 
}