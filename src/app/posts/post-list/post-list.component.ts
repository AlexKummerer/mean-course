import { PostService } from './../post.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  private postsSub!: Subscription;
  isLoading = false;
  constructor(public postService: PostService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();
    this.postsSub = this.postService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  onDeletePost(postId: string) {
    this.postService.deletePost(postId);
  }
}
