

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
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

/*       User is signed in.
 */      
      var displayName = user.displayName;
      var email = user.email;
      // var emailVerified = user.emailVerified;
      // var isAnonymous = user.isAnonymous;
      // var uid = user.uid;
      // var providerData = user.providerData;

   firebase.database().ref("/users").set({
          user: displayName,
          email: email
      })
      console.log(displayName + ", you successfully signed in")
    } else {
      // not signed in
      $(".guest-text").addClass("visible")
    }
  });
  
var db;
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
    db = firebase.database()


    //  This will replace the content 
 
    // db.ref("/upcomingQs").set({
    //     questionsLeft: 0
    // })
   
    db.ref("/activeQ").set({
        timeLeft: 30
    })

    //  this function will return a question object
   
   // a little flippy floppy magic
    $(".choice").on("click",function(){
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
    function makeSampleQs(numQs){
      var questions = [];
      for(var i = 0;i<numQs;i++){
        // push `numQs` # of questions into array to return
       questions.push(QuestionObject("question"+i,
                  Math.floor(Math.random()*5),
                  Math.floor(Math.random()*100),
                  "user"+Math.floor(Math.random()*125),
                  new Date().toString()))
      }
      return questions;
    }
     // will append data 
  function addToHistorical(QList){
    // add only when we have a list of 15 or less
    if(QList.length<=15){
      QList.forEach(function(question){
        db.ref("/historical").push(question)
      })
    }  
  }
    var list = makeSampleQs(12);
    addToHistorical(list);
    
    
});






