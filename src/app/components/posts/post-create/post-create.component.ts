import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from 'src/app/models/Post.model';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  @ViewChild('createPostForm') createPostForm: NgForm;
  private mode = 'create';
  private postId:string;
  public post: Post;
  isLoading:boolean = false;


  constructor(private postService: PostsService, private route:ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap:Params)=>{
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.params.id;
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((result)=>{
          this.post = {
            title: result.data.title,
            content: result.data.content
          };
          this.isLoading = false;
        })
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });

  }

  onSubmit() {
    if(this.createPostForm.valid) {
      this.isLoading = true;
      const post =  {
        title: this.createPostForm.value.title,
        content: this.createPostForm.value.content
      }
      if(this.mode == 'create') {
        this.postService.createPost(post);
      } else {
        this.postService.updatePost(this.postId, post);
      }
     this.router.navigate(['/']);
      this.createPostForm.resetForm();
    }
  }

}
