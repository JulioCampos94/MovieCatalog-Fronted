import { Component } from '@angular/core';
import { MovieService } from '../movie.service';
import { Movie } from '../movie.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MovieModalComponent } from '../movie-modal/movie-modal.component';
import { MovieSearchModalComponent } from '../movie-search-modal/movie-search-modal.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  imports: [CommonModule, FormsModule, RouterModule, MovieModalComponent, MovieSearchModalComponent] 
})
export class MainComponent {
  movies: Movie[] = [];
  newMovie: Movie = { id: 0, title: '', actors: '', image: "", synopshis: "", categories: [] };
  searchTitle: string = '';
  deleteTitle: string = '';
  editMovie: Movie = { id: 0, title: '', actors: '', image: "", synopshis: "", categories: [] };
  isModalOpen = false;
  isModalSearchOpen = false;
  movieToShow: Movie | null = null;

  constructor(private movieService: MovieService, private dialog: MatDialog, private http: HttpClient) {}

  openMoviesDialog() {
    this.loadMovies();
    this.isModalOpen = true;
  }

  closeMoviesDialog() {
    this.isModalOpen = false;
  }

  loadMovies(): void {
    this.movieService.getMovies().subscribe(
      (movies: Movie[]) => {
        if (Array.isArray(movies)) {
          this.movies = movies.sort((a, b) => a.title.localeCompare(b.title));
        } else {
          console.error('Received data is not an array:', movies);
        }
      },
      (error) => {
        console.error('Error loading movies:', error);
      }
    );
  }

  searchMovie(): void {
    if (this.searchTitle.trim() === '') {
      alert('Please enter a movie title to search.');
      return;
    }

    const searchTitleLower = this.searchTitle.trim().toLowerCase();

    this.movieService.getMovieByTitle(searchTitleLower).subscribe({
      next: (movie) => {
        if (movie) {
          this.movieToShow = movie; 
          this.isModalSearchOpen = true;  
        } else {
          alert('Movie not found');
          this.movieToShow = null;
        }
        this.searchTitle = '';
      },
      error: (err) => {
        alert('Error searching for movie. Please try again.');
        console.error('Search movie error:', err);
      }
    });
  }

  deleteMovie() {
    if (this.deleteTitle.trim() === '') {
      alert('Please enter a movie title to delete.');
      return;
    }
    const deleteTitleLowerCase = this.deleteTitle.toLowerCase();
  
    this.movieService.deleteMovieByTitle(deleteTitleLowerCase).subscribe({
      next: () => {
        this.loadMovies(); 
        this.deleteTitle = ''; 
        alert('Movie deleted successfully.');
      },
      error: () => {
        alert('Movie with this title does not exist.');
        this.deleteTitle = "";
      }
    });
  }

  updateMovie() {
    if (!this.editMovie.title.trim() || !this.editMovie.actors.trim() || !this.editMovie.image.trim() || !this.editMovie.synopshis.trim()) {
      alert('Please fill in all fields.');
      return;
    }
    const editMovieTitleLower = this.editMovie.title.trim().toLowerCase();

    this.movieService.getMovieByTitle(editMovieTitleLower).subscribe({
      next: (existingMovie) => {
        if (existingMovie) {
          this.movieService.updateMovie(editMovieTitleLower, this.editMovie).subscribe(() => {
            this.loadMovies();
            alert('Movie updated successfully.');
            this.resetEditMovie();
          });
        } else {
          alert('Movie not found.');
          this.resetEditMovie();
        }
      },
      error: (err) => {
        alert('Error updating movie. Please try again.');
        this.resetEditMovie();
        console.error('Update movie error:', err);
      }
    });
  }

  addMovie() {
    const { title, actors, synopshis, image, categories } = this.newMovie;
  
    if (!title.trim() || !actors.trim() || !image.trim() || !synopshis.trim()) {
      alert('Please fill in all fields.');
      return;
    }  
    this.movieService.getMovies().subscribe((movies: Movie[]) => {
      const newTitleLowerCase = title.toLowerCase();
      const movieExists = movies.some(movie => movie.title.toLowerCase() === newTitleLowerCase);
  
      if (movieExists) {
        alert('Movie with this title already exists.');
        this.resetNewMovie();
        return;
      }
  
      this.movieService.addMovie(this.newMovie).subscribe(() => {
        this.loadMovies();
        this.resetNewMovie();

        alert("New movie added to the catalog");
      }, (err) => {
        alert('Error adding movie. Please try again.');
        console.error('Add movie error:', err);
      });
    }, (err) => {
      alert('Error loading movies to check for duplicates.');
      console.error('Load movies error:', err);
    });
  }
  
  resetNewMovie() {
    this.newMovie = { id: 0, title: '', actors: '', image: '', synopshis: '', categories: [] };
  }

  resetEditMovie() { 
    this.editMovie = { id: 0, title: '', actors: '', image: '', synopshis: '', categories: [] };
  }

  fetchMovieDetails(title: string) {
    this.movieService.getMovieByTitle(title.toLowerCase()).subscribe({
      next: (movie) => {
        if (movie) {
          this.editMovie = movie; 
        } else {
          alert('Movie not found.');
        }
      },
      error: (err) => {
        alert('Movie not found');
        console.error('Fetch movie details error:', err);
      }
    });
  }

  onTitleBlur() {
    const trimmedTitle = this.editMovie.title.trim().toLowerCase();
    if (trimmedTitle) {
      this.fetchMovieDetails(trimmedTitle);
    }
  }

  addCategoryToNewMovie() {
    const newCategory = prompt('Enter new category:');
    if (newCategory) {
      this.newMovie.categories.push(newCategory.trim());
    }
  }

  removeCategoryFromNewMovie(category: string) {
    this.newMovie.categories = this.newMovie.categories.filter(c => c !== category);
  }

  addCategoryToEditMovie() {
    const newCategory = prompt('Enter new category:');
    if (newCategory) {
      this.editMovie.categories.push(newCategory.trim());
    }
  }

  removeCategoryFromEditMovie(category: string) {
    this.editMovie.categories = this.editMovie.categories.filter(c => c !== category);
  }
}
