import { Post } from './../post.model';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
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
  imagePreview!: string;
  form: FormGroup = new FormGroup({});

  private mode = 'create';
  private postId!: string | null;
  post!: Post | null;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.form = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [ mimeType],
      }),
    });

    this.route.paramMap.subscribe(async (paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId') as string;
        this.isLoading = !this.isLoading;
        await this.postService
          .getPostById(this.postId)
          .subscribe((postData: Post | null) => {
            console.log(postData);

            if (postData) {
              this.post = {
                id: postData.id,
                title: postData.title,
                content: postData.content,
                imagePath: postData.imagePath,
              };
              this.form.setValue({
                title: this.post.title,
                content: this.post.content,
                image: this.post.imagePath,
              });
              this.imagePreview = this.post.imagePath as string;
              this.isLoading = false;
            }
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  async onImagePicked(event: Event) {
    console.log('onImagePicked called');
    const file = (event.target as HTMLInputElement).files![0];
    console.log('Selected file:', file);
   this.form.patchValue({ image: file });
  await this.form.get('image')?.updateValueAndValidity();
    console.log(this.form.get('image'));

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    console.log(this.form.get('image'));
    reader.readAsDataURL(file);
}

  public async onSavePost(): Promise<void> {
    console.log(this.form);

    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    const post: Post = {
      id: this.postId ? this.postId : '',
      title: this.form.value?.title ?? '',
      content: this.form.value?.content ?? '',
      image: this.form.value?.image ?? '',
    };
    console.log(post);

    if (this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      console.log(post);

      await this.postService.updatePostbyId(this.postId as string, post);
    }

    this.form.reset();
  }
}
