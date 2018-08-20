// VARIABLES
var question = '';

// Temporary question array for testing - this should be done firebase-side
var questionsArray = [];

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
        var down = $('<i class="downvote fas fa-chevron-down"></i>');     
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


function updateVote() {
    for (var i = 0; i < questionsArray.length; i++) {
        $(`#rating-${i}`).text(questionsArray[i].up - questionsArray[i].down)
    }
}

// EVENTS

// Event that retrieves from database and then calls function to update DOM
// db.ref().on('child_added', function(snapshot) {
//     question = snapshot.val().q;
//     upvotes = snapshot.val().up;
//     downvotes = snapshot.val().down;

//     addQuestion();
// });

$(document).on('click', `.upvote`, function() {
    var index = (this.id).split('-').slice(-1);

    // Temporary local array for testing
    questionsArray[index].up++;

    // firebase - not sure how this works with selecting the specific question
    // upVotes++;
    // db.ref().set({
    //     up: upVotes
    // })
    
    // addQuestion();
    updateVote();
    console.log(`#${this.id} Upvoted!`);
});

$(document).on('click', `.downvote`, function() {
    var index = (this.id).split('-').slice(-1);

    // Temporary local array for testing
    questionsArray[index].down++;

    // firebase - not sure how this works with selecting the specific question
    // downVotes++
    // db.ref().set({
    //     down: downVotes
    // })
    
    // addQuestion();
    updateVote();
    console.log(`#${this.id} Downvoted!`);
});

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