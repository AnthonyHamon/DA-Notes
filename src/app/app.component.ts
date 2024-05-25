import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(){
    console.log("constructor AppComponent");
  }
  ngOnInit(): void {
   console.log("ngOnInit AppComponent");
  }
  title = 'DAKeep';
  addDialogOpen = false;
}
