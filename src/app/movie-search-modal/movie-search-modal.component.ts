import { Component, Input } from '@angular/core';
import { Movie } from '../movie.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-search-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-search-modal.component.html',
  styleUrl: './movie-search-modal.component.css'
})
export class MovieSearchModalComponent {
  @Input() movie: Movie | null = null;

  close() {
    this.movie = null;
  }
}
