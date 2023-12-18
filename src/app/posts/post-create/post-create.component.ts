import { Post } from './../post.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  isLoading = false;
  imagePreview!: string;
  form: FormGroup = new FormGroup({});
  private mode = 'create';
  private postId!: string | null;
  post!: Post | null;
  private authStatusSub!: Subscription;

  constructor(
    public postService: PostService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(() => {
        this.isLoading = false;
      });

    this.form = new FormGroup({
      title: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId') as string;
        this.isLoading = true;
        this.postService.getPostById(this.postId).subscribe(
          (postData: Post | null) => {
            if (postData) {
              this.post = {
                id: postData.id,
                title: postData.title,
                content: postData.content,
                imagePath: postData?.imagePath || '',
              };
              this.form.setValue({
                title: this.post.title,
                content: this.post.content,
                image: this.post?.imagePath || '',
              });
              this.imagePreview = this.post.imagePath || '';
              this.isLoading = false;
            }
          },
        );
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  public async onSavePost(): Promise<void> {
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

    if (this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      this.postService
        .updatePostbyId(this.postId as string, post)
        .then(() => {
          this.router.navigate(['/']);
        });
    }
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
