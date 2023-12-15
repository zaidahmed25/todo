import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth , db} from "./config.js";
import { collection, addDoc, getDocs, Timestamp, query , orderBy, deleteDoc, doc, updateDoc, where} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js"; 




onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        const q = query(collection(db, "users"), where("uid", "==", uid));
        renderTodo(user.uid)
    } else {
        window.location = 'index.html'
    }
});


const form = document.querySelector('#form');
const text = document.querySelector('#text');
const submit = document.querySelector('#submit');
const todocard = document.querySelector('#todocard');



const logout = document.querySelector('#logout-btn');

logout.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('logout successfully');
        window.location = 'index.html'
    }).catch((error) => {
        console.log(error);
    });
})

let arr = []

async function renderTodo() {

    arr.length = 0;
    const q = await query(collection(db, "todo"), orderBy('todoDate', 'desc') );
    // console.log(uid);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        console.log(doc.data());
        arr.push({...doc.data(), docId: doc.id });
    });
    console.log(arr);
    card.innerHTML = ''
    arr.map((item) => {
        card.innerHTML += `
        <div class="card w-75 mb-3 m-5 p-3 border-black">
            <div class="card-body">
                <div class="flex">
                <div>
                <p class="card-text text-start h2"><span class="h2 fw-bold">Todo : </span>${item.text}</p>
                </div>
                <div>
                <button type="button" id="delete" class="btn btn-outline-danger">Delete</button>
                <button type="button" id="edit" class="btn btn-outline-info">Edit</button>
                </div>
            </div>
        </div>`
    })

    const del = document.querySelectorAll('#delete');
    const ed = document.querySelectorAll('#edit');

    del.forEach((btn, index) => {
        btn.addEventListener('click', async () => {
            console.log('delete called', arr[index]);
            await deleteDoc(doc(db, "todo", arr[index].docId))
                .then(() => {
                    console.log('todo deleted');
                    arr.splice(index, 1);
                    renderTodo()
                });
        })
    })
    ed.forEach((btn, index) => {
        btn.addEventListener('click', async () => {
            console.log('edit called', arr[index]);
            const updatedText = prompt('enter new todo');
            await updateDoc(doc(db, "todo", arr[index].docId), {
                text: updatedText
            });
            arr[index].text = updatedText;
            renderTodo()

        })
    })
}


renderTodo()



// async function getDataFromFirestore(uid) {
//     arr.length = 0;
//     const q = await query(collection(db, "todo"), orderBy('todoDate', 'desc') , where('uid' , '==' , uid));
//     console.log(uid);
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//         console.log(doc.data());
//         arr.push({...doc.data(), docId: doc.id });
//     });
//     console.log(arr);
//     renderTodo();
// }





form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const postObj = {
        text: text.value,
        uid: auth.currentUser.uid,
        postDate: Timestamp.fromDate(new Date())
    }
    try {
        
        const docRef = await addDoc(collection(db, "todo"), postObj);
        console.log("Document written with ID: ", docRef.id);
        postObj.docId = docRef.id;
        arr = [postObj, ...arr];
        console.log(arr);
        renderTodo();
    } catch (e) {
        console.error("Error adding document: ", e);
    }
    text.value =""
})