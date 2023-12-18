import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PostService } from './post.service';
import { Post } from './post.model';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl + 'posts/';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService],
    });

    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests
  });

  it('should fetch posts', () => {
    const dummyPosts: Post[] = [
      {
        id: '1',
        title: 'Post 1',
        content: 'Content 1',
        imagePath: '',
        creator: '',
      },
      {
        id: '2',
        title: 'Post 2',
        content: 'Content 2',
        imagePath: '',
        creator: '',
      },
    ];

    service.getPosts(2, 1);

    const req = httpMock.expectOne(`${API_URL}?pageSize=2&page=1`);
    expect(req.request.method).toBe('GET');
    req.flush({
      message: 'Fetched successfully',
      posts: dummyPosts,
      maxPosts: 2,
    });

    service.getPostUpdateListener().subscribe((postData) => {
      expect(postData.posts.length).toBe(2);
      expect(postData.posts).toEqual(dummyPosts);
      expect(postData.postCount).toBe(2);
    });
  });

  it('should add a post', () => {
    const newPost: Post = {
      id: '1',
      title: 'Post 1',
      content: 'Content 1',
      imagePath: '',
      creator: '',
    };

    service.addPost(newPost);

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Post added', post: newPost });
  });

  it('should fetch a post by id', () => {
    const dummyPost: Post = {
      id: '1',
      title: 'Post 1',
      content: 'Content 1',
      imagePath: '',
      creator: '',
    };

    service.getPostById('1').subscribe((post) => {
      console.log(post);
      expect(post?.title).toEqual(dummyPost.title);
    });

    const req = httpMock.expectOne(`${API_URL}1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPost);
  });

  it('should update a post', async () => {
    const updatedPost: Post = {
      id: '1',
      title: 'Updated Post',
      content: 'Updated Content',
      imagePath: '',
      creator: '',
    };

    (await service.updatePostbyId('1', updatedPost)).subscribe((res) => {
      expect(res).toEqual({ message: 'Post updated', post: updatedPost });
    });

    const req = httpMock.expectOne(`${API_URL}1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ message: 'Post updated', post: updatedPost });
  });

  it('should delete a post', () => {
    service.deletePost('1').subscribe((res) => {
      expect(res).toEqual({ message: 'Post deleted' });
    });

    const req = httpMock.expectOne(`${API_URL}1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Post deleted' });
  });
});
