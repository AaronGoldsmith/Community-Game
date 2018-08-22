

function QuestionObject(q,up,down,aut,date){
  let question = {
    _question: q,
    upvotes: up,
    downvotes: down,
    author: aut,
    date: date
  }
  return question;
}
// function getRedditData(subreddit,maxQs){
//   var queryURL = "https://www.reddit.com/r/"+ subreddit +"/top/.json?count=10";
//   //gets a large chunk of data about a question
//   var questions = [];
//   $.ajax({
//     url: queryURL,
//     data: {limit: maxQs, order: "desc"}, 
//     method: "GET"
//   }).then(function(response) {
//       return response;
//   //   console.log(response);
//   //   console.log(response.data);
//   })
// }

  
var uiConfig = {
  callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // setPersistence()
      console.log("login success")
      return true;
      },
      uiShown: function() {
        console.log('Please login, guest')
      }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'index.html',
  signInOptions:  [firebase.auth.EmailAuthProvider.PROVIDER_ID, 
                  firebase.auth.GoogleAuthProvider.PROVIDER_ID]
                    };
// initialized with defaults
$(document).ready(function(){

    //  check if the current user session is in our db
  firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var displayName = user.displayName;
        var email = user.email;
     db.ref("/users/").push({
            user: displayName,
            email: email
      })
        console.log(displayName + ", you successfully signed in")
      } else {
        // not signed in
        $(".guest-text").addClass("visible")
      }
    });

  if(!firebase.auth().user){
      $(".guest-text").removeClass("hidden")
  }
    // creates the login container
    $("#login").on("click",function()
    {

      var b4ui = $("<div>").attr("id","firebaseui-auth-container")
      $(".modal").modal("toggle")
      $(".modal-body").append(b4ui)
      var ui = new firebaseui.auth.AuthUI(firebase.auth());

      ui.start('#firebaseui-auth-container', uiConfig)
    })

   
   // a little flippy floppy magic
    $(".game-buttons").on("click","button",function(){
      // check which btn class we have, and remove it
      if($(this).hasClass("btn-success")){
        $(this).removeClass("btn-success")
      }
      else if($(this).hasClass("btn-danger")){
        $(this).removeClass("btn-danger");
      } 
      else{
        // check to see which button we clicked on
        if($(this).attr("id")=="agree"){
          $(this).addClass("btn-success")
          $(this).siblings().removeClass("btn-danger")
        }
        else{
          $(this).addClass("btn-danger")
          $(this).siblings().removeClass("btn-success")
        }
      }
    });
    // function makeSampleQs(numQs){
    //   var questions = [];
    //   for(var i = 0;i<numQs;i++){
    //     // push `numQs` # of questions into array to return
    //    questions.push(QuestionObject("question"+i,
    //               Math.floor(Math.random()*5),
    //               Math.floor(Math.random()*100),
    //               "user"+Math.floor(Math.random()*125),
    //               new Date().toString()))
    //   }
    //   return questions;
    // }
     // will append data 
  // function addToHistorical(QList){
  //   // add only when we have a list of 15 or less
  //   if(QList.length<=15){
  //     QList.forEach(function(question){
  //       firebase.database().ref("/historical").push(question)
  //     })
  //   }  
  // }
    // addToHistorical(list);
    
    
});






