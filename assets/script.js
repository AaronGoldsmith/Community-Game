
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
  

    // everytime page loads or value changes
    //   db.ref().on("value", function(snapshot) {
    //     db.ref().set({
    //         name: "Administrator",
    //         email: "example@gmail.com",
    //         age: "20",
    //         comment: "Lorem Ipsum Dorem lipsum",
    //       });
    // });


});

// function setPersistence(){
//   firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
//           return firebase.auth().signInWithEmailAndPassword(email, password);
//   }).catch(function(error) {
//       var errorCode = error.code;
//       var errorMessage = error.message;
//       console.log(errorCode + ": " +errorMessage)
//   });
// }
// 



