import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Movie } from './movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:3000/movies';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  getMovieByTitle(title: string): Observable<Movie | undefined> {
    return this.http.get<Movie>(`${this.apiUrl}/${title}`);
  }

  addMovie(movie: Movie): Observable<Movie> {
   return this.http.post<Movie>(this.apiUrl, movie);
  }

  updateMovie(title: string, updatedMovie: Movie): Observable<Movie> {
    return this.http.put<Movie>(`${this.apiUrl}/${title}`, updatedMovie);
  }

  deleteMovieByTitle(title: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${title}`);
  }
}
