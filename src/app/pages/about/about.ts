import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogService } from '../../services/blog.service';
import { Author } from '../../post.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {
  authors: Author[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getPosts().subscribe(({ posts }) => {
      const uniqueAuthors = new Map<string, Author>();

      for (const post of posts) {
        uniqueAuthors.set(post.author.name, post.author);
      }

      this.authors = Array.from(uniqueAuthors.values());
    });
  }
}
