import { PostsService } from './../../../services/posts.service';
import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/models/Post.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  @Input() posts:Post[] = [];
  postSub: Subscription;
  isLoading:boolean = false;
  length = 10;
  pageSize = 2;
  pageSizeOptions = [1,2,5,10];
  currPage = 1;
  
  constructor(private postService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.pageSize, this.currPage);
    this.postSub = this.postService.getPostUpdateListener().subscribe((posts: Post[])=>{
      this.isLoading = false;
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.postSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
  
  onChangedPage(event:PageEvent) {
    this.currPage = event.pageIndex+1;
    this.pageSize = event.pageSize;
    this.postService.getPosts(this.pageSize, this.currPage);
  }
}
