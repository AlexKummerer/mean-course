import { Post } from '../posts/post.model';

export function createFormData(post: Post): FormData {
  const postData = new FormData();
  postData.append('id', post.id);
  postData.append('title', post.title);
  postData.append('content', post.content);
  if (post.image && typeof post.image !== 'string') {
    postData.append('image', post.image, post.title);
  }
  return postData;
}
