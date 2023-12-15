import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(
        map((postData) => {
          return postData.posts.map((post: any) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
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

  getPostById(id: string): Observable<Post | null> {
    return this.http
      .get<{ _id: string; title: string; content: string; imagePath: string }>(
        'http://localhost:3000/api/posts/' + id
      )
      .pipe(
        map((postData) => {
          return {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
          };
        }),
        catchError(() => {
          return of(null);
        })
      );
  }

  addPost(newPost: Post) {
    const postData = new FormData();
    postData.append('title', newPost.title);
    postData.append('content', newPost.content);
    if (newPost.image) {
      if (typeof newPost.image === 'string') {
        postData.append('image', newPost.image);
      } else {
        postData.append('image', newPost.image, newPost.title);
      }
    }
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((respData) => {
        const post: Post = {
          id: respData.post.id,
          title: newPost.title,
          content: newPost.content,
          imagePath: respData.post.imagePath,
        };

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
      });
  }

  async updatePostbyId(postId: string, post: Post) {
    console.log(post);

    let postData: Post | FormData;
    if (typeof post.image === 'object') {
      postData = new FormData();
      postData.append('id', post.id);
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', post.image, post.title);
    } else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: post.image ? post.image.toString() : undefined,
      };
    }

    this.http
      .put('http://localhost:3000/api/posts/' + postId, postData)
      .subscribe((response) => {
        console.log(response);

        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);
        const newPost: Post = {
          id: postId,
          title: post.title,
          content: post.content,
          image: post.imagePath,
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
}
