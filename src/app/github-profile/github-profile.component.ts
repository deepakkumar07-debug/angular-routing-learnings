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
