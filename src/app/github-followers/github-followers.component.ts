import { GithubFollowersService } from './../services/github-followers.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@Component({
  selector: 'github-followers',
  templateUrl: './github-followers.component.html',
  styleUrls: ['./github-followers.component.css']
})
export class GithubFollowersComponent implements OnInit {
  followers: any[];

  constructor(
    private route: ActivatedRoute,
    private service: GithubFollowersService) { }

  ngOnInit() {
    // we combine 2 observables and subscribe to this one observable
    Observable.combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ])
    .subscribe(combined => { //combined is an array with 2 elements 1=> latest paramMap obj 2=> latest queryparamMap
      let id = combined[0].get('id'); // this wont work but idea is how to use
      let page = combined[1].get('page')
      
      // calling api 
      // this.service.getImaginaryPaginatedData({id:id, page:page})
      this.service.getAll()
      .subscribe(followers => this.followers = followers);
    })

    let page = this.route.snapshot.queryParamMap.get('page')
    console.log('page number',page)
    // this.service.getAll()
    //   .subscribe(followers => this.followers = followers);
  }
}
