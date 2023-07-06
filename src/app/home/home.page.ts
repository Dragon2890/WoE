import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { delay } from 'rxjs';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Capacitor } from '@capacitor/core';

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
  inputFieldString: string = '';
  errorMessage: string = '';

  moviesOutput: Movie[] = [];
  Ratings: Rating[] = [];

  isAlertOpen: boolean = false;

  fullMovie: FullMovie = {} as FullMovie;

  //  haptic vairiable

  hapticsImpactLight = async () => {
    await Haptics.impact({ style: ImpactStyle.Light });
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {}

  public alertButtons = ['OK'];

  ngOnInit(): void {
    // this.SetOpen(true, "tt0110912")
  }

  // page navigation

  NextPage() {
    this.router.navigate(['/page2']);
  }

  async Load() {
    const loading = await this.loadingCtrl.create({
      duration: 1000000000000,
    });

    loading.present();
  }

  // loading wheel

  async Search() {
    this.isAlertOpen = false;
    const loading = await this.loadingCtrl.create({
      duration: 1000000000000,
    });

    loading.present();

    // give user feedback when they search
    this.hapticsImpactLight();

    // error catching when seatching

    try {
      this.http
        .get(
          'https://www.omdbapi.com/?apikey=4ebba5e1&s=' + this.inputFieldString
        )
        .subscribe({
          next: (res: any) => {
            console.log(res.Search);
            this.moviesOutput = res.Search;
            loading.dismiss();

            console.log(res);

            if (res.Search === undefined) {
              this.isAlertOpen = true;
              this.errorMessage = res?.Error;
            }
            // else {{

            // }}
          },
          error: (err: any) => {
            console.warn('there is an error', err);
            this.isAlertOpen = true;
            this.errorMessage = err.message;
          },
        });
    } catch (err: any) {
      console.log('error', err);
    }
  }

  isModalOpen = false;

  // open modal of movie clicked on

  async OpenModal(imdbID?: string) {
    this.Load();

    this.fullMovie = {} as FullMovie;

    if (imdbID) {
      this.http
        .get('https://www.omdbapi.com/?apikey=4ebba5e1&i=' + imdbID)
        .subscribe((res: any) => {
          console.log(res);
          if (res.Response == 'False') {
            this.isAlertOpen = true;
            this.errorMessage = res?.Error;
          } else {
            this.fullMovie = res;
            this.ToggleModal(true);
          }
        });
    }

    this.hapticsImpactLight();
  }

  ToggleModal(value: boolean) {
    this.isModalOpen = value;
  }

  async startScan() {
    await BarcodeScanner.checkPermission({ force: true }).then(async (res) => {
      console.log(res);

      document.getElementById('ionApp')!.classList.add('qrEnabled');
      document.body.style.background = 'transparent';

      BarcodeScanner.hideBackground(); // make background of WebView transparent

      const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

      // if the result has content
      if (result.hasContent) {
        this.closeQrCode();
        console.log(result.content); // log the raw scanned content
        this.OpenModal(result.content);
      }
    });
  }

  closeQrCode() {
    console.log('closeQR');
    if (Capacitor.isNativePlatform()) {
      BarcodeScanner.stopScan();
      BarcodeScanner.showBackground();
    }
    document.getElementById('ionApp')!.classList.remove('qrEnabled');
  }
}

// this.http.get("https://www.omdbapi.com/?apikey=4ebba5e1&s=" + this.inputFieldString)
