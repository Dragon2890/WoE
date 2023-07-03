import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  
  inputFieldString: string=""

  listInput: string[]=[]

  constructor(private router: Router) {}
  ngOnInit(): void {

  }

  NextPage() {
    this.router.navigate(['/page2'])
  }

  AddList() {
    this.listInput.push(this.inputFieldString)
    this.listInput.forEach(inputFieldString => {
    console.log(inputFieldString)
    });
  }
}