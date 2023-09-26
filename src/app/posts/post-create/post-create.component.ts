import { Post } from './../post.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  newPost = 'NO CONTENT';
  enteredContent: string = '';
  enteredTitle: string = '';
  isLoading = false;
  private mode = 'create';
  private postId!: string | null;
  post!: Post | null;
  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId') as string;
        this.isLoading = !this.isLoading;
        this.post = this.postService.getPostById(this.postId);
        this.isLoading = !this.isLoading;
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  public onSavePost(form: NgForm): void {
    console.log(form);
    if (!form.valid) {
      return;
    }
    const post: Post = {
      id: this.postId ? this.postId : '',
      title: form.value.title,
      content: form.value.content,
    };

    if (this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      this.postService.updatePostbyId(this.postId as string, post);
    }

    form.resetForm();
  }
}
