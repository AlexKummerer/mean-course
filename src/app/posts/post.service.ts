import { Injectable, Injector } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, max } from 'rxjs/operators';
import { environment } from '../../environments/environment'


const API_URL =   environment.apiUrl + 'posts/';
@Injectable({ providedIn: 'root' })
export class ServiceNameService {
  constructor(private httpClient: HttpClient) {}
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private injector: Injector
  ) {
    setTimeout(() => (this.http = injector.get(HttpClient)));
  }

  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        API_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              } as Post;
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPosts) => {
        console.log(transformedPosts);

        const { posts, maxPosts } = transformedPosts;
        this.posts = posts as Post[];
        this.postsUpdated.next({ posts: this.posts, postCount: maxPosts });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPostById(id: string): Observable<Post | null> {
    return this.http
      .get<{
        _id: string;
        title: string;
        content: string;
        imagePath: string;
        creator: string;
      }>(API_URL + id)
      .pipe(
        map((postData) => {
          return {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator,
          } as Post;
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
        API_URL,
        postData
      )
      .subscribe((respData) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete( API_URL + postId);
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
      .put(API_URL + postId, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      });
  }
}
