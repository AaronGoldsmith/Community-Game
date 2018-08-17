var config = {
    apiKey: "AIzaSyAH20Zs8h38Z36SewkTWnVHLO3t7DsSG3g",
    authDomain: "community-survey-c406d.firebaseapp.com",
    databaseURL: "https://community-survey-c406d.firebaseio.com",
    projectId: "community-survey-c406d",
    storageBucket: "community-survey-c406d.appspot.com",
    messagingSenderId: "765662643308"
};

firebase.initializeApp(config);
var db = firebase.database();
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var dbRef = db.ref();
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
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

$(document).ready(function(){
    
    $("#login").on("click",function(){
      ui.start('#firebaseui-auth-container', uiConfig);
      console.log($("#firebaseui-auth-container").child());
    })

    // everytime page loads
    dbRef.on("child_added", function(snapshot) {
        console.log(snapshot)
        dbRef.push({
            name: "test",
            email: "test@test.com",
            age: "20",
            comment: "Lorem Ipsum Dorem lipsum",
          });
    });

});


