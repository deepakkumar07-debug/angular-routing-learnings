import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-github-profile',
  templateUrl: './github-profile.component.html',
  styleUrls: ['./github-profile.component.css']
})
export class GithubProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // in keys we have id because in router path we configured 
      //  path: "followers/:id",
      // console.log('params',params)
      let id = +params.get('id') // will convert string to number
      console.log(id)
    })
  }

  submit() {
    this.router.navigate(['/followers',1,2,3]) // parameters => http://localhost:4400/followers/1/2/3

    // query params
    //  this will navigate without page refresh

    // this.router.navigate(['/followers'],{
    //   queryParams: {page:1, order: 'newest'}
    // }) 
    
    // http://localhost:4400/followers?page=1&order=newest
  }
}
