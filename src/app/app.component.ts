import { Component, Injectable, OnInit } from '@angular/core';
import { ApisService } from './service/apis.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { FormsModule } from '@angular/forms';
import { IGuest } from './interfaces/iguest';
import { Message } from './interfaces/imessage';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';
declare var swal: any;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  NoOfDays: number;
  names: string[];
  model: any;
  searching = false;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);
  closeResult: string;
  myGuests: IGuest[];
  message: Message;
  showPopUp: boolean;
  curGuest: IGuest;

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.api.getGuests(term)
          .do(() => {
            this.searchFailed = false;
            }
          )
          .catch(() => {
            this.searchFailed = true;
            return of([]);
          }))
      .do(() => this.searching = false)
      .merge(this.hideSearchingWhenUnsubscribed)

      formatter = (x: IGuest) => {this.myGuests.push(x); return ''; };
      res_formatter = (x: IGuest) => x.title + ' ' + x.first_name + ' ' + x.last_name;

  constructor(
    public api: ApisService
  ) {
    this.showPopUp = false;
    this.myGuests = [];
    this.message = new Message('', '', '');
   }

  ngOnInit() {
    this.api.getCountdown().subscribe((posts) => {
      this.NoOfDays = posts.days;
    } );
  }

  getGuests(q: string) {
    this.api.getGuests(q).subscribe((posts) => {
      this.names = posts;
    } );
  }

  removeGuest(x: IGuest) {
    this.myGuests.splice(this.myGuests.indexOf(x), 1);
  }

  changeGoing(x: IGuest) {
    const index: number = this.myGuests.indexOf(x);
    if ( x.attending === 1 ) {
      x.attending = 0;
      this.myGuests[index].attending = 0;
      return false;
    } else {
      x.attending = 1;
      this.myGuests[index].attending = 1;
      return true;
    }
  }


  saveMyGuests() {
      this.api.saveGuest(this.myGuests).subscribe((res) => {
        this.message = res;
        this.showPopUp = false;
        if (this.message.category === 'ERROR') {
            swal({
              type: 'error',
              title: 'Oops...',
              text: 'Something went wrong! ' + this.message.message,
              footer: this.message.description
            });
          } else {

            swal.setDefaults({
              type: 'question',
              width: 1200,
              html: '<table class="table"><tr><td>Do you require a bus?</td>' +
                '<td><input type="checkbox" id="bus_day"> Day </td> ' +
                '<td><input type="checkbox" id="bus_night"> Night </td></tr>' +
                '<tr><td>Starter</td><td><input type="checkbox" name="bus_night"> Starter 1</td>' +
                '<td><input type="checkbox" name="bus_night"> Starter 2</td></tr>' +
                '<tr><td>Main Course</td><td><input type="checkbox" name="bus_night"> Main Course 1</td>' +
                '<td><input type="checkbox" name="bus_night"> Main Course 2</td></tr>' +
                '<tr><td>Desert</td><td><input type="checkbox" name="bus_night"> Desert 1</td>' +
                '<td><input type="checkbox" name="bus_night"> Desert 2</td></tr>' +
                '<tr><td rowspan="2">Dietry Requirements : </td><td colspan="2">' +
                '<input type="checkbox" name="vege"> Vegetarian</td></tr>' +
                '<tr><td colspan="2"><textarea rows="2" name="extra_details"></textarea></td></tr>' +
                '<table>'
                ,
              confirmButtonText: 'Next &rarr;'
            });

            const steps: string[] = [];

            for (let g of this.myGuests) {
              if (g.attending) {
                steps.push('Requirements for ' + g.first_name + ' ' + g.last_name +
                      '<input type="hidden" name="user_id" value="' + g.user_id + '">');
              }
            }

            swal.queue(steps).then(
              $('.swal2-confirm').click(function() {
                console.log($('#bus_day').is(':checked'));
              })
            );
          }
        }
      );
  }
}
