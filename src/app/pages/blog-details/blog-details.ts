import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BlogService } from '../../services/blog.service';
import { Post } from '../../post.model';

interface ArticleBlock {
  heading?: string;
  body?: string;
  id?: string;
}

@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
})
export class BlogDetails implements OnInit {
  post: Post | null = null;
  relatedPosts: Post[] = [];
  articleBlocks: ArticleBlock[] = [];
  headings: { title: string; id: string }[] = [];
  copied = false;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.blogService.getPosts().subscribe(({ posts }) => {
      this.route.paramMap.subscribe((params) => {
        this.loadPost(params.get('slug'), posts);
      });
    });
  }

  get formattedDate(): string {
    if (!this.post) {
      return '';
    }

    return new Intl.DateTimeFormat('ar', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${this.post.date}T00:00:00`));
  }

  get shareUrl(): string {
    return typeof window === 'undefined' ? '' : encodeURIComponent(window.location.href);
  }

  async copyArticleLink(): Promise<void> {
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof window !== 'undefined') {
      await navigator.clipboard.writeText(window.location.href);
      this.copied = true;
    }
  }

  private loadPost(slug: string | null, posts: Post[]): void {
    this.post = posts.find((post) => post.slug === slug) ?? null;

    if (!this.post) {
      this.relatedPosts = [];
      this.articleBlocks = [];
      this.headings = [];
      return;
    }

    this.headings = [];
    this.articleBlocks = this.post.content
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => {
        if (block.startsWith('## ')) {
          const title = block.slice(3).trim();
          const id = `section-${this.headings.length}`;
          this.headings.push({ title, id });
          return { heading: title, id };
        }

        return { body: block };
      });

    this.relatedPosts = posts
      .filter((post) => post.category === this.post?.category && post.slug !== this.post.slug)
      .slice(0, 3);
  }
}
