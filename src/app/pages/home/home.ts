import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BlogService } from '../../services/blog.service';
import { Post } from '../../post.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home-page.css',
})
export class Home implements OnInit {
  featuredPosts: Post[] = [];

  categories: { name: string; count: number }[] = [];

  latestPosts: Post[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getPosts().subscribe({
      next: (response) => {
        const posts = response.posts;

        this.featuredPosts = posts.filter((post) => post.featured).slice(0, 3);

        this.latestPosts = [...posts]
          .filter((post) => !post.featured)
          .sort((first, second) => second.date.localeCompare(first.date))
          .slice(0, 3);

        const categoryNames = [...new Set(posts.map((post) => post.category))];
        const categoryOrder = ['إضاءة', 'بورتريه', 'مناظر طبيعية', 'تقنيات', 'معدات'];

        this.categories = categoryNames
          .sort((first, second) => categoryOrder.indexOf(first) - categoryOrder.indexOf(second))
          .map((name) => ({
            name,
            count: posts.filter((post) => post.category === name).length,
          }));
      },

      error: (error) => {
        console.error('Error loading posts:', error);
      },
    });
  }
}
