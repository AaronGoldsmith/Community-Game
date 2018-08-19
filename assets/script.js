function setPersistence(){
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(function() {
          return firebase.auth().signInWithEmailAndPassword(email, password);
  }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode + ": " +errorMessage)
  });
}
// initialized with defaults
$(document).ready(function(){
    if(firebase.auth().currentUser){
      $(".guest-text").css("visibility","hidden!important")
    }
   var db = firebase.database()
   var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            $(".guest-text").css("visibility","hidden")
            setPersistence()
            console.log("login success")
            return true;
            },
            uiShown: function() {
              console.log('load')
              // document.getElementById('loader').style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: 'index.html',
        signInOptions:  [firebase.auth.EmailAuthProvider.PROVIDER_ID, 
                        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        firebase.auth.FacebookAuthProvider.PROVIDER_ID]
    };

    // creates the login container
    $("#login").on("click",function()
    {
      var ui = new firebaseui.auth.AuthUI(firebase.auth());

      var b4ui = $("<div>").attr("id","firebaseui-auth-container")
      $(".modal").modal("toggle")
      $(".modal-body").append(b4ui)
      ui.start('#firebaseui-auth-container', uiConfig)
    })

    // everytime page loads or value changes
    //   db.ref().on("value", function(snapshot) {
    //     db.ref().set({
    //         name: "Administrator",
    //         email: "aargoldsmith@gmail.com",
    //         age: "20",
    //         comment: "Lorem Ipsum Dorem lipsum",
    //       });
    // });


});



