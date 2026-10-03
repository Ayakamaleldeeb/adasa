import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { BlogService } from '../../services/blog.service';
import { Post } from '../../post.model';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog implements OnInit {
  posts: Post[] = [];

  searchText = '';

  selectedCategory = 'جميع المقالات';

  categories: string[] = [];

  currentPage = 1;

  readonly pageSize = 6;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.blogService.getPosts().subscribe((data) => {
      this.posts = data.posts;

      this.categories = [...new Set(this.posts.map((post) => post.category))];

      const requestedCategory = this.route.snapshot.queryParamMap.get('category');
      this.selectedCategory =
        requestedCategory && this.categories.includes(requestedCategory)
          ? requestedCategory
          : 'جميع المقالات';
    });
  }

  get filteredPosts(): Post[] {
    const search = this.searchText.trim().toLowerCase();

    return this.posts.filter((post) => {
      const matchesCategory =
        this.selectedCategory === 'جميع المقالات' || post.category === this.selectedCategory;

      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search) ||
        post.excerpt.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPosts.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get visiblePosts(): Post[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPosts.slice(start, start + this.pageSize);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.resetPage();
  }

  resetPage(): void {
    this.currentPage = 1;
  }

  setPage(page: number): void {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
  }
}
