import { Component } from '@angular/core';
import { Post } from '../post.model'
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  newPost = 'NO CONTENT'
  enteredContent: string = ""
  enteredTitle: string = ""


  constructor(public postService: PostService) {

  }

  public onAddPost(form: NgForm): void {
    console.log(form);
    if (!form.valid) {
      return
    }
    const post: Post = {
      title: form.value.title,
      content: form.value.content
    }

    this.postService.addPost(post)

  }




}
