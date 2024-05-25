import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, doc, collectionData, onSnapshot, CollectionReference, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);


  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;

  constructor() {
    // this.addNOte();
    this.unsubNotes = this.subNoteList();
    this.unsubTrash = this.subTrashList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIDFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.log(err); }
      )
    }
  }

  async deleteNote(colId: "notes" | "trash", docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) =>{ console.log(err) }
    );
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getColIDFromNote(note: Note) {
    if (note.type == 'note') {
      return 'notes'
    } else {
      return 'trash'
    }
  }


  async addNote(item: Note, colId: "notes" | "trash") {
    if(colId == "notes"){
      await addDoc(this.getNotesRef(), item).catch(
        (err) => { console.log(err) }
      ).then(
        (docRef) => { console.log("document writen with ID", docRef?.id) }
      )
    }else{
      await addDoc(this.getTrashRef(), item).catch(
        (err) => { console.log(err) }
      ).then(
        (docRef) => { console.log("document writen with ID", docRef?.id) }
      )
    }
  }

    // async addNote(item: Note, colId: "notes" | "trash") {
  //     await addDoc(this.getNotesRef(), item).catch(
  //       (err) => { console.log(err) }
  //     ).then(
  //       (docRef) => { console.log("document writen with ID", docRef?.id) }
  //     )
  // }


  // my try =>
  // async addNOte(){
  //   await addDoc(this.getNotesRef(), {
  //     title: "FireBase lernen",
  //     content: "",
  //     marked: false,
  //     type: "note",
  //   })
  // }


  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  ngonDestroy() {
    this.unsubNotes();
    this.unsubTrash();
    this.unsubMarkedNotes();
  }


  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
        console.log(this.setNoteObject(element.data(), element.id))
      });
    });
  }

  subNoteList() {
    let subColRef = collection(this.firestore, "notes/documentID/collectionName") // um auf einen subcollection zuzugreifen.
    const q = query(this.getNotesRef(), where("marked", "==", false), limit(100))
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
        console.log(this.setNoteObject(element.data(), element.id))
      });
      list.docChanges().forEach((change) => {
        if (change.type === "added") {
            console.log("New note: ", change.doc.data());
        }
        if (change.type === "modified") {
            console.log("Modified note: ", change.doc.data());
        }
        if (change.type === "removed") {
            console.log("Removed note: ", change.doc.data());
        }
      });
    });
    
  }

  subMarkedNotesList() {
    const q = query(this.getNotesRef(), where("marked", "==", true), limit(100))
    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach(element => {
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
        console.log(this.setNoteObject(element.data(), element.id))
      });
    });
  }

  // getNotesRef(): CollectionReference<Note, Note> {
  //   return collection(this.firestore, 'notes') as unknown as CollectionReference<Note, Note>;
  // }


  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }









  // this code is used fby using collectionData instead of OnSnapshot //

  // item$;
  // items;

  // constructor(){
  //   this.item$ = collectionData(this.getNotesRef());
  //   this.items = this.item$.subscribe((list) => {
  //     list.forEach(element => {

  //       console.log(element)
  //     });
  //   })
  // }

  // getNotesRef():  CollectionReference<Note, Note> {
  //   return collection(this.firestore, 'notes') as unknown as CollectionReference<Note, Note>;
  // }

  // ngonDestroy(){
  //   this.items.unsubscribe();
  // }
}
