import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface'
import { Firestore, collection, doc, collectionData, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  // trashNotes: Note[] = [];
  // normalNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);

  item$;
  items;
  // unsubList;
  // unsubSingle;

  constructor() {

    // this.unsubList = onSnapshot(this.getNotesRef(), (list) => {
      
    //   list.forEach(element => {
    //     console.log(element)
    //   });
    // } );

    // this.unsubSingle = onSnapshot(this.getSingleDocRef("notes", "awodbwadbawidba"), (element) => {
    //   console.log(element)
    // } );

 


    this.item$ = collectionData(this.getNotesRef());
    this.items = this.item$.subscribe((list) => {
      list.forEach(element => {
        
        console.log(element)
      });
    })

  }

  ngonDestroy(){
    this.items.unsubscribe();
    // this.unsubList();
    // this.unsubSingle();
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId)
  }

}
