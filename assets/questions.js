var question = '';

function addQuestion() {
    // Create single row+column for new question
    var newRow = $('<tr>');
    var newCol = $('<td>');
    // Create upvote+downvote arrows
    var upVote = $('<i class="upvote fas fa-chevron-up"></i>');
    var downVote = $('<i class="downvote fas fa-chevron-down"></i>');
    var arrows = $('<div class="votes">');
    arrows.append(upVote);
    arrows.append(downVote);
    newCol.append(question);
    newRow.append(newCol);
    newCol.prepend(arrows);
    $('#tba-container').append(newRow);
};

$('#submit').on('click', function() {
    event.preventDefault();
    question = $('#question-input').val().trim();

    addQuestion();
    $('#question-input').val('');
    // debugging 
    if(firebase.auth().currentUser){
        console.log("you are signed in")
    }
});