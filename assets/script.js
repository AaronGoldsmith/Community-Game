

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

var uiConfig = {
  callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        console.log("login was successful")
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

// EVERYTIME our authentication status changes
firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
         // this is a new user in our DB 
         //  (i.e logging in for the first time)

        var displayName = user.displayName;
        var email = user.email;
        var first = displayName.split(" ")[0];

        db.ref("users/").push({
                user: displayName,
                email: email
        })
        console.log(first + ", you successfully signed in")
      } else {
        $(".guest-text").addClass("visible")
      }
    });

    if(!firebase.auth().user){
        $(".guest-text").removeClass("hidden")
    }
    // handles clicking login and creates the firebase ui login flow
    $("#login").on("click",function()
    {
      var b4ui = $("<div>").attr("id","firebaseui-auth-container")
      $(".modal").modal("toggle")
      $(".modal-body").append(b4ui)

      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', uiConfig)
    })

   // a little flippy floppitty magic
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

});






