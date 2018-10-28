import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from 'src/app/models/Post.model';
import { PostsService } from 'src/app/services/posts.service';
import { mimeType } from 'src/app/modules/mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  // @ViewChild('createPostForm') createPostForm: NgForm;
  private mode = 'create';
  private postId:string;
  public post: Post;
  isLoading:boolean = false;
  postCreateForm:FormGroup;
  imagePreview:string;


  constructor(private postService: PostsService, private route:ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.postCreateForm = new FormGroup({
      title: new FormControl(null, {validators:[Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators:[Validators.required]}),
      image: new FormControl(null, {validators:[Validators.required],asyncValidators:[mimeType]})
    });

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
          this.postCreateForm.patchValue({
            title: this.post.title,
            content: this.post.content
          });
          this.isLoading = false;
        })
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });

  }

  onSubmit() {
    if(this.postCreateForm.valid) {
      this.isLoading = true;
      const post =  {
        title: this.postCreateForm.value.title,
        content: this.postCreateForm.value.content
      };
      if(this.mode == 'create') {
        this.postService.createPost(post, this.postCreateForm.value.image);
      } else {
        this.postService.updatePost(this.postId, post);
      }
     this.router.navigate(['/']);
      this.postCreateForm.reset();
    }
  }

  onImagePick(event: Event) {
    const file  = (event.target as HTMLInputElement).files[0];
    this.postCreateForm.patchValue({
      image:file
    });
    this.postCreateForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

}
