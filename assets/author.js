db = firebase.database()

function clearHistory(){
  db.ref("/historical").set({
    minSinceUpdate: 0 
  })
}


