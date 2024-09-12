import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieSearchModalComponent } from './movie-search-modal.component';

describe('MovieSearchModalComponent', () => {
  let component: MovieSearchModalComponent;
  let fixture: ComponentFixture<MovieSearchModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieSearchModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
