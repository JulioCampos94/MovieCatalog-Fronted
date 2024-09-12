import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';  
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MovieService } from '../movie.service';
import { Movie } from '../movie.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]  
})
export class MovieFormComponent {
  movies: Movie[] = [];
  movie: Movie = { id: 0, title: '', actors: '', synopshis: "", image:""};
  isNew: boolean = true;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    if (id) {
      this.isNew = false;
      this.movieService.getMovies().subscribe(movie => {
        if (movie) {
          this.movies = movie;
        }
      });
    }
  }

  save(): void {
    if (this.isNew) {
      this.movieService.addMovie(this.movie);
    } else {
      this.movieService.updateMovie(this.movie);
    }
    this.router.navigate(['/movies']);
  }
}
