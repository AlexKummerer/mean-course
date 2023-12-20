import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { createFormData } from '../utility/createFormData';

console.log(environment);

const API_URL = environment.apiUrl + 'posts/';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        API_URL + queryParams
      )
      .pipe(map(this.transformPosts), catchError(this.handleError))
      .subscribe((transformedPosts) => {
        if (transformedPosts) {
          this.posts = transformedPosts.posts;
          this.postsUpdated.next({
            posts: [...this.posts],
            postCount: transformedPosts.maxPosts,
          });
        }
      });
  }
  private transformPosts(postData: { posts: any[]; maxPosts: number }) {
    return {
      posts: postData.posts.map((post) => ({
        title: post.title,
        content: post.content,
        id: post._id,
        imagePath: post.imagePath,
        creator: post.creator,
      })),
      maxPosts: postData.maxPosts,
    };
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
        map(this.transformPost),
        catchError(() => of(null))
      );
  }

  private transformPost(postData: {
    _id: string;
    title: string;
    content: string;
    imagePath: string;
    creator: string;
  }) {
    return {
      id: postData._id,
      title: postData.title,
      content: postData.content,
      imagePath: postData.imagePath,
      creator: postData.creator,
    } as Post;
  }

  addPost(newPost: Post) {
    const postData: FormData = createFormData(newPost);
    console.log(postData);

    this.http
      .post<{ message: string; post: Post }>(API_URL, postData)
      .subscribe(() => this.router.navigate(['/']));
  }

  private handleError(error: any): Observable<null> {
    console.error('An error occurred', error);
    return of(null);
  }

  deletePost(postId: string) {
    return this.http.delete(API_URL + postId);
  }

  async updatePostbyId(postId: string, post: Post) {
    let postData: Post | FormData;
    if (typeof post.image === 'object') {
      postData = createFormData(post);
    } else {
      postData = {
        id: post.id,
        title: post.title,
        content: post.content,
        imagePath: post.image ? post.image.toString() : undefined,
      };
    }
    return this.http.put(API_URL + postId, postData);
  }
}
