// VARIABLES
var question = '';

// Temporary question array for testing - this should be done firebase-side
var questionsArray = [
    {q: 'Is this an example question?', up: 0, down: 0 },
    {q: 'Is this the second example question?', up: 0, down: 0 }
];

// FUNCTIONS

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
        up.attr('data-vote', 'none');
        var down = $('<i class="downvote fas fa-chevron-down"></i>');
        down.attr('data-vote', 'none');
        var arrows = $('<div class="votes">');

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


function updateVote(index) {
    $(`#rating-${index}`).text(questionsArray[index].up - questionsArray[index].down);
   
};

// EVENTS

// Event that retrieves from database and then calls function to update DOM
// db.ref().on('child_added', function(snapshot) {
//     question = snapshot.val().q;
//     upvotes = snapshot.val().up;
//     downvotes = snapshot.val().down;

//     addQuestion();
// });

// User upvotes a question
$(document).on('click', `.upvote`, function() {
    // Index to use for local array for testing
    var index = (this.id).split('-').slice(-1);
    
    
    var upElem = $(`#up-${index}`);
    var downElem = $(`#down-${index}`);

    var upState = upElem.attr('data-vote');
    var downState = downElem.attr('data-vote');

    if (upState === 'none' && downState === 'none') {
        upElem.attr('data-vote', 'upvoted');

        questionsArray[index].up++;
    }
    else if (upState === 'upvoted') {
        console.log('You already upvoted.');
        return false;
    }
    else if (downState === 'downvoted') {
        console.log('You changed your vote.');
        upElem.attr('data-vote', 'upvoted');
        downElem.attr('data-vote', 'none');
        
        questionsArray[index].up++;
        questionsArray[index].down--;
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

    if (upState === 'none' && downState === 'none') {
        downElem.attr('data-vote', 'downvoted');

        questionsArray[index].down++;
    }
    else if (downState === 'downvoted') {
        console.log('You already downvoted.');
        return false;
    }
    else if (upState === 'upvoted') {
        console.log('You changed your vote.');
        upElem.attr('data-vote', 'none');
        downElem.attr('data-vote', 'downvoted');
        
        questionsArray[index].up--;
        questionsArray[index].down++;
    }

    // firebase - not sure how this works with selecting the specific question
    // downVotes++
    // db.ref().set({
    //     down: downVotes
    // })
    
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

// Updating the DOM with the sample questions from the array
addQuestion(); 

function formatCMV( redditTitle ){  
    if(redditTitle.substring(0,4) === "CMV:"){ 
        var questionPart = redditTitle.substring(4,redditTitle.length)
        return "Do you think " + questionPart;
    }
    return false;
 }

function formatDAE( redditTitle ){  
    if(redditTitle.substring(0,3) === "DAE"){ 
        var questionPart = redditTitle.substring(3,redditTitle.length)
        return "Do you " + questionPart;
    }
    return false;
 }
