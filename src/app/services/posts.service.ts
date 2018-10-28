import { ApiResult } from './../models/ApiResult.model';
import { Post } from "../models/Post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';

@Injectable({
    providedIn:'root'
})
export class PostsService{
    
    posts: Post[] = [];
    postsUpdated: Subject<Post[]> = new Subject<Post[]>();

    constructor(private http: HttpClient){}

    getPosts() {
        this.http.get<ApiResult>('http://localhost:3000/api/posts')
                .pipe(map((result)=>{
                    return result.data.map((post:any)=>{
                       return {
                           id:post._id,
                           title:post.title,
                           content:post.content
                       };
                    });
                }))
                .subscribe(
                    (posts) => {
                        this.posts = posts;
                        this.postsUpdated.next([...this.posts]);
                    }
                );
    }

    getPostUpdateListener() {
        return this.postsUpdated.asObservable();
    }

    createPost(post: Post) {
        this.http.post<{status:string, data:any}>('http://localhost:3000/api/posts/create', post)
                .pipe(map((result) => {
                    post.id = result.data._id;
                    return post;
                }))
                .subscribe((transformedPost)=>{
                    this.posts.push(transformedPost);
                    this.postsUpdated.next([...this.posts]);
                });
    }

    deletePost(postId:string) {
        this.http.delete('http://localhost:3000/api/posts/delete/'+postId)
                .pipe(map((result:any)=>{
                    return result.data.id;
                }))
                 .subscribe((postId)=>{
                    this.posts = this.posts.filter((post:Post)=>{
                        return post.id != postId; 
                    });
                    this.postsUpdated.next([...this.posts]);
                 });

    }

    updatePost(id:string, post:{title:string, content: string}) {
        this.http.put('http://localhost:3000/api/posts/update/'+id, post)
            .subscribe((result)=>{
                console.log(result);
            });
    }

    getPost(postId: string) {
       return this.http.get<{status:string, data:Post}>('http://localhost:3000/api/posts/'+postId);
    }

}