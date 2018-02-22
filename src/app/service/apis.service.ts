import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { IGuest } from '../interfaces/iguest';
import 'rxjs/add/operator/map';

@Injectable()
export class ApisService {
  countdown: number;
  headers: Headers;
  options: RequestOptions;

  constructor(public http: Http) {
      this.headers = new Headers({ });
        this.options = new RequestOptions({ headers: this.headers });
  }

  getCountdown() {
    return this.http.get('/api/countdown.php').map(res => res.json());
  }

  getGuests(q: string) {
    return this.http.get('/api/guests/search?q=' + q).map(res => res.json());
  }

  saveGuest(q: IGuest[]) {
    const body = JSON.stringify(q);
    return this.http.post('/api/guests/save', body, this.options).map(res => res.json());
  }
}
