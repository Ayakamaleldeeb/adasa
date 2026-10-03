import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import postsData from '../../assets/posts.json';
import { Post } from '../post.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly posts = postsData.posts as Post[];

  getPosts(): Observable<{ posts: Post[] }> {
    return of({ posts: this.posts });
  }

  getPostBySlug(slug: string): Observable<{ posts: Post[] }> {
    return of({
      posts: this.posts.filter((post) => post.slug === slug),
    });
  }
}
