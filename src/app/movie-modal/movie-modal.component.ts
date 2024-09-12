import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Movie } from '../movie.model';
import { MovieService } from '../movie.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-modal',
  standalone: true,
  templateUrl: './movie-modal.component.html',
  styleUrls: ['./movie-modal.component.css'],
  imports: [CommonModule]
})
export class MovieModalComponent {
  @Input() movies: Movie[] = [];
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  constructor(private movieService: MovieService) {}

  close() {
    this.closeModal.emit();
  }
}
