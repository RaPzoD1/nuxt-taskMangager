import firebase from 'firebase/app'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAgyWf7rEkFSMUMUtHSvMga9sH71TMt6RE",
    authDomain: "task-manager-51745.firebaseapp.com",
    projectId: "task-manager-51745",
    storageBucket: "task-manager-51745.appspot.com",
    messagingSenderId: "985794610871",
    appId: "1:985794610871:web:6ed8db1bc56b43c2996f32",
    measurementId: "G-4H9MQY56NE"
  }

  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig)
  }

  export default firebase