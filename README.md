# Angular Router Learnings
To work with Router first we need to import `Router` module from angular Router on `app.module.ts`
- then register router module in `imports []` then call `forRoot([])` static method and configure routes as follows

```ts
import { GithubFollowersService } from "./services/github-followers.service";
import { AppErrorHandler } from "./common/app-error-handler";
import { PostService } from "./services/post.service";
import { HttpModule } from "@angular/http";
import { SignupFormComponent } from "./signup-form/signup-form.component";
import { SummaryPipe } from "./summary.pipe";
import { AuthorsService } from "./authors.service";
import { CoursesService } from "./courses.service";
import { CoursesComponent } from "./courses.component";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule, ErrorHandler } from "@angular/core";

import { AppComponent } from "./app.component";
import { CourseComponent } from "./course/course.component";
import { AuthorsComponent } from "./authors/authors.component";
import { FavoriteComponent } from "./favorite/favorite.component";
import { PanelComponent } from "./panel/panel.component";
import { InputFormatDirective } from "./input-format.directive";
import { TitleCasePipe } from "./title-case.pipe";
import { LikeComponent } from "./like/like.component";
import { ZippyComponent } from "./zippy/zippy.component";
import { ContactFormComponent } from "./contact-form/contact-form.component";
import { NewCourseFormComponent } from "./new-course-form/new-course-form.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { PostsComponent } from "./posts/posts.component";
import { GithubFollowersComponent } from "./github-followers/github-followers.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { GithubProfileComponent } from "./github-profile/github-profile.component";
import { NotFoundComponent } from "./not-found/not-found.component";

@NgModule({
  declarations: [
    AppComponent,
    SignupFormComponent,
    CourseComponent,
    CoursesComponent,
    AuthorsComponent,
    SummaryPipe,
    FavoriteComponent,
    PanelComponent,
    InputFormatDirective,
    TitleCasePipe,
    LikeComponent,
    ZippyComponent,
    ContactFormComponent,
    NewCourseFormComponent,
    ChangePasswordComponent,
    PostsComponent,
    GithubFollowersComponent,
    NavbarComponent,
    HomeComponent,
    GithubProfileComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: "followers/:username",
        component: GithubProfileComponent,
      },
      {
        path: "followers", // if we configure above path down below then this component also gets displayed
        component: GithubFollowersComponent,
      },
      {
        path: "posts",
        component: PostsComponent,
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
    ]),
  ],
  providers: [
    PostService,
    CoursesService,
    AuthorsService,
    GithubFollowersService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

```
## Router-Outlet
- now we configured the route path now to render component on these routes we need to add `<router-outlet></router-outlet>` element

- router outlet is directive defined in `Router` Module when angular sees it . Its gonna render the component associated with the current route after this `<router-outlet></router-outlet>` element. So its not gonna render it inside this element
- if we inspect we can see

```html
<app-root>
    <navbar></navbar>
    <router-outlet></router-outlet>
    <app-home></app-home>
</app-root>
```
- now our home page works and also if we navigate to `http://localhost:4400/followers` we will see list of followers
- `http://localhost:4400/followers/1` github profile component also works
- `http://localhost:4400/posts` our posts component also works
- if we go to invalid url our not found component also works

## RouterLink
Navigate to `navbar` component replace href attribute with `routerLink` directive
- the difference between these two is routerlink wont reload entire page
```html
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li class="active"><a routerLink="/followers">Followers</a></li>
        <li><a routerLink="/posts">Posts</a></li>
      </ul>
    </div>
  </div>
</nav>
```
- now lets add specific follower router for that we use `property binding syntax` 
- route will be `/followers/1`

```code
[routerLink]="['/followers', follower.id]" syntax is this
```
- for complex routing we use property binding with array of 2 params 
- param 1 is path param 2 is route args
```html
<div *ngFor="let follower of followers" class="media">
  <div class="media-left">
    <a href="#">
      <img class="avatar media-object" src="{{ follower.avatar_url }}" alt="...">
    </a>
  </div>
  <div class="media-body">
      <!-- new changes -->
    <h4 class="media-heading">
      <a [routerLink]="['/followers', follower.id]">{{ follower.login }}</a>
    </h4>
     <!-- new changes -->
    <a href="follower.html_url">{{ follower.html_url }}</a>
  </div>
</div>
```

## RouterLinkActive
`routerLinkActive` takes a list of css strings as a value. for our case we have only one css class name called `active`

`navbar`
```html
  <li routerLinkActive="active current"><a routerLink="/followers">Followers</a></li>
        <li routerLinkActive="active current"><a routerLink="/posts">Posts</a></li>
```

## Accessing Route Parameters
In our GithubProfileComponent router takes parameter `username` in real world application we will be having this kind of requirements

- now go to `github-profile.ts` in order to work with route params we have to inject `ActivatedRoute` class in constructor this also a service

- on ngOnInit we use `this.route.paramMap` this property contains all route params. the type of this property is an observable of type ParamMap `Observable<ParamMap>` its an observable so we can subscribe it.

`github-profile.ts`
```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-github-profile',
  templateUrl: './github-profile.component.html',
  styleUrls: ['./github-profile.component.css']
})
export class GithubProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // in keys we have id because in router path we configured 
      //  path: "followers/:id",
      // console.log('params',params)
      let id = +params.get('id') // will convert string to number
      console.log(id)
    })
  }

}

```
## Why route params are observables

- we know when component route changes previous component gets destroyed by ngDestroy lifecycle
- when to use paramMap.subscribe if we decided to stay on the same page do some kind of sorting or anything our route is changed so we have to subscribe and get new url param
- if we decided to to visit the page by going back and forth and we want get route param we dont have to subscribe because each time it gets loaded a component when we visit that time we can use

```ts
 ngOnInit() {
let id = this.route.snapshot.paramMap.get('id');
```
}

## Routes with Multiple Parameters

we want to access url like this `path: "followers/:id/:username",`
to achieve this we follow exactly before additional add extra param on `routerLink`

`github-profile.html`
```html
    <a [routerLink]="['/followers', follower.id, follower.login]">{{ follower.login }}</a>
```

## Query Parameters
There are times we want to add optional parameters in our routes
examples 
in our routes we passed as query strings
`/followers?page=1&order=newest` . page and order these or optional parameters these are not needed to load this page

**Sending query param**
- How to use this like how we used `routerLink` directive

`navbar.html`

for now its hardcoded
```code
 <a routerLink="/followers"
    [queryParams]="{page:1, order: 'newest'}">Followers</a></li>
```
```html
<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li routerLinkActive="active current">
            <a routerLink="/followers"
              [queryParams]="{page:1, order: 'newest'}">Followers</a>
        </li>
        <li routerLinkActive="active current"><a routerLink="/posts">Posts</a></li>
      </ul>
    </div>
  </div>
</nav>
```
**Recieving QueryParam**
`github-follower-component.ts`

```ts
import { GithubFollowersService } from './../services/github-followers.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
    this.route.paramMap.subscribe()
    let id = this.route.snapshot.paramMap.get('id');

    // queryparam
    this.route.queryParamMap.subscribe();
    let page = this.route.snapshot.queryParamMap.get('page')
    console.log('page number',page)
    this.service.getAll()
      .subscribe(followers => this.followers = followers);
  }
}
```

## Subscribing to Multiple Observables
we combine 2 observables and subscribe to this one observable
`GithubFollowersComponent`

```ts
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
```

## The SwitchMap Operator
- now our current implementation on `GithubFollowersComponent` ngOnit we have `subscribe()` inside another `subscribe method`
- it looks like ugly in our code now we going to cleanup this 
by writing more cleaner and elegant

- use switchMap operator

```ts
import { GithubFollowersService } from './../services/github-followers.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { combineLatest } from 'rxjs/observable/combineLatest';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

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
    .switchMap(combined => { // this also returns ParamMap[] subscribe also returns ParamMap[] on this case. our aim is to eliminate nested subscribe
      let id = combined[0].get('id'); // this wont work but idea is how to use
      let page = combined[1].get('page')
      
      // calling api 
      // this.service.getImaginaryPaginatedData({id:id, page:page})
      return this.service.getAll()
      // we dont need subscribe here
      // .subscribe(followers => this.followers = followers);
    })
    .subscribe(followers => { //combined is an array with 2 elements 1=> latest paramMap obj 2=> latest queryparamMap
     this.followers = followers
    })

    let page = this.route.snapshot.queryParamMap.get('page')
    console.log('page number',page)
    // this.service.getAll()
    //   .subscribe(followers => this.followers = followers);
  }
}
```

## Programmatic Navigation

`githubprofile-component`

```ts
  submit() {
    this.router.navigate(['/followers',1,2,3]) // parameters => http://localhost:4400/followers/1/2/3
  }
```

```ts
  submit() {

    // query params
    //  this will navigate without page refresh

    this.router.navigate(['/followers'],{
      queryParams: {page:1, order: 'newest'}
    }) 
    
    // http://localhost:4400/followers?page=1&order=newest
  }
```

# Exercise Blog Archives

Simple Router Navigation Exercise
## Creating Components

    ng g c home

    ng g c not-found

    ng g c archive

## Importing and configuring Router module

1. on the top import router module
2. register router module on imports array

`app-module.ts`

```ts
import { RouterModule } from '@angular/router';

 imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'archive/:year/:month', component: ArchiveComponent },
      { path: '**', component: NotFoundComponent }
    ])
  ],
```
## Adding Router outlet
Navigate to app.html

`app-component.htm`

```html
<router-outlet></router-outlet>
```

## Render list of Archives on HomePage

`home-component.ts`

```ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  archives = [
    { year: 2017, month: 1 },
    { year: 2017, month: 2 },
    { year: 2017, month: 3 },
  ];

  constructor() { }

  ngOnInit() {
  }

}
```
`home.html`
```html

<h1>Home Page</h1>
<ul>
  <li *ngFor="let archive of archives">
    <a
      [routerLink]="['/archive', archive.year, archive.month]"
      >{{ archive.year + '/' + archive.month }}</a>
  </li>
</ul>
```

`archive.ts`
```ts
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  year: number;
  month: number; 

  constructor(
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    let params = this.route.snapshot.paramMap;
    this.year = +params.get('year');
    this.month = +params.get('month');
  }

  viewAll() {
    this.router.navigate(['/']);
  }
}

```

`archive.html`
```html

<h1>Archive for {{ year }} / {{ month }}</h1>

<button (click)="viewAll()">View All</button>
```
## Blog Exercise Complete Code

[visit here for source code for blog exercise](https://github.com/deepakkumar07-debug/angular-routing-blog)