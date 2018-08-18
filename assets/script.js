var db = firebase.database();

$('#modalContainer').modal("show")                      // initialized with defaults

$(document).ready(function(){

   var uiConfig = {
        callbacks: {
            signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            return true;
            },
            uiShown: function() {
              document.getElementById('loader').style.display = 'none';
            }
        },
        // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
        signInFlow: 'popup',
        signInSuccessUrl: 'index.html',
        signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID, 
                        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        firebase.auth.FacebookAuthProvider.PROVIDER_ID],
    };


    $("#login").on("click",function()
    {
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', {
        signInFlow: 'popup',
        signInSuccessUrl: '../index.html',
        signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID, 
                        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        firebase.auth.FacebookAuthProvider.PROVIDER_ID]
      });
    })

    // everytime page loads or value changes
      db.ref().on("value", function(snapshot) {
        db.ref().set({
            name: "test",
            email: "test@test.com",
            age: "20",
            comment: "Lorem Ipsum Dorem lipsum",
          });
    });

});



