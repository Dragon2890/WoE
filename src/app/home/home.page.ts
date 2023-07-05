import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface FullMovie {
  Actors: string;
  Awards: string;
  BoxOffice: string;
  Country: string;
  DVD: string;
  Director: string;
  Genre: string;
  Language: string;
  Metascore: number;
  Plot: string;
  Poster: string;
  Production: string;
  Rated: string;
  Released: string;
  Response: string;
  Runtime: string;
  Title: string;
  Type: string;
  Website: string;
  Writer: string;
  Year: string;
  imdbID: string;
  imdbRating: string;
  imdbVotes: string;
  Ratings: Rating[];
}

export interface Rating {
  Source: string;
  Value: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  inputFieldString: string = ""

  moviesOutput: Movie[] = []
  Ratings: Rating[] = []
  
  fullMovie: FullMovie = {} as FullMovie

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.SetOpen(true, "tt0110912")

  }

  NextPage() {
    this.router.navigate(['/page2'])
  }

  Search() {
    this.http.get("http://www.omdbapi.com/?apikey=4ebba5e1&s=" + this.inputFieldString).subscribe((res: any) => {
      console.log(res.Search)
      this.moviesOutput = res.Search
    })
  }

  isModalOpen = false;

  SetOpen(isOpen: boolean, imdbID?: string) {

    if (imdbID) {

      this.http.get("http://www.omdbapi.com/?apikey=4ebba5e1&i=" + imdbID).subscribe((res: any) => {
        console.log(res)
        this.fullMovie = res
      })
    }

    this.isModalOpen = isOpen

  }
}


