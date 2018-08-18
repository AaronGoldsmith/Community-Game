var db = firebase.database();

// initialized with defaults

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
        signInOptions:  [firebase.auth.EmailAuthProvider.PROVIDER_ID, 
                        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        firebase.auth.FacebookAuthProvider.PROVIDER_ID]
    };


  //   $('#modalContainer').on('show.bs.modal', function (e) {
     
  // })
  
    // creates the login container
    $("#login").on("click",function()
    {
      var b4ui = $("<div>").attr("id","firebaseui-auth-container")
      $(".modal").modal("toggle")
      $(".modal-body").append(b4ui)
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start('#firebaseui-auth-container', {
        
        signInFlow: 'popup',
        signInSuccessUrl: '../index.html',
        signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID, 
                        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        firebase.auth.FacebookAuthProvider.PROVIDER_ID]
      });
       console.log($("#modalContainer"))
    })

    // everytime page loads or value changes
      db.ref().on("value", function(snapshot) {
        db.ref().set({
            name: "Administrator",
            email: "aargoldsmith@gmail.com",
            age: "20",
            comment: "Lorem Ipsum Dorem lipsum",
          });
    });

});



