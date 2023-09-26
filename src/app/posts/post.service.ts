import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ServiceNameService {
  constructor(private httpClient: HttpClient) {}
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient, private router: Router) {}

  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  getPostById(id: string): Post | null {
    return id ? { ...(this.posts.find((p) => p.id === id) as Post) } : null;
  }

  addPost(post: Post) {
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((resp) => {
        const postId = resp.postId;
        post.id = postId;
        console.log(resp.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        console.log('Deleted');
      });
  }

  updatePostbyId(postId: string, post: Post) {
    this.http
      .put('http://localhost:3000/api/posts/' + postId, post)
      .subscribe((response) => {
        console.log(response);
      });
  }
}
