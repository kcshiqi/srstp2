import * as firebase from 'firebase';

const config = {

	// 2k records
// 	apiKey: "AIzaSyDI0VMCBkQi8UIU_eQUw0mUs2sZozc7_Lw",
//     authDomain: "testbug-2ec8c.firebaseapp.com",
//     databaseURL: "https://testbug-2ec8c.firebaseio.com",
//     projectId: "testbug-2ec8c",
//     storageBucket: "testbug-2ec8c.appspot.com",
//     messagingSenderId: "968021625049"


		apiKey: "AIzaSyDI0VMCBkQi8UIU_eQUw0mUs2sZozc7_Lw",
    authDomain: "for-sq-test.firebaseapp.com",
    databaseURL: "https://for-sq-test.firebaseio.com",
    projectId: "for-sq-test",
    storageBucket: "for-sq-test.appspot.com",
    messagingSenderId: "777238405996"
};
firebase.initializeApp(config);

export default firebase;