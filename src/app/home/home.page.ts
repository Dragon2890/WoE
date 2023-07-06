import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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
  errorMessage: string = ""

  moviesOutput: Movie[] = []
  Ratings: Rating[] = []

  isAlertOpen: boolean = false

  fullMovie: FullMovie = {} as FullMovie

  hapticsImpactLight = async () => {
    await Haptics.impact({ style: ImpactStyle.Light })
  };

  constructor(private router: Router, private http: HttpClient, private loadingCtrl: LoadingController) { }

  public alertButtons = ['OK'];

  ngOnInit(): void {
    // this.SetOpen(true, "tt0110912")

  }

  NextPage() {
    this.router.navigate(['/page2'])
  }

  async Search() {
    this.isAlertOpen = false
    const loading = await this.loadingCtrl.create({
      duration: 1000000000000,
    });

    loading.present();

    this.hapticsImpactLight()

    try {
      this.http.get("http://www.omdbapi.com/?apikey=4ebba5e1&s=" + this.inputFieldString).subscribe({
        next: (res: any) => {
          console.log(res.Search)
          this.moviesOutput = res.Search
          loading.dismiss();

          console.log(res)

          if (res.Search === undefined) {
            this.isAlertOpen = true
            this.errorMessage = res?.Error;

          }
          // else {{

          // }}

        }, error: (err: any) => {
          console.warn("there is an error", err)
          this.isAlertOpen = true
          this.errorMessage = err.message
        }
      })

    }

    catch (err: any) {
      console.log("error", err)
    }

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

    this.hapticsImpactLight()

  }

}
