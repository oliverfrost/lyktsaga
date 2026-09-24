import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Book } from '@lyktsaga/shared-types';
import { environment } from '../../../../environments/environment';
import { BooksApiService } from './books-api.service';

const sampleBook: Book = {
  id: 'b1',
  title: 'Dune',
  author: 'Frank Herbert',
  description: null,
  publisher: 'Chilton Books',
  yearPublished: 1965,
  price: '9.99',
  currency: 'USD',
  isbn: null,
  language: 'en',
  coverImageUrl: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('BooksApiService', () => {
  let service: BooksApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BooksApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches books from the store-api books endpoint', () => {
    let result: Book[] | undefined;

    service.getBooks().subscribe((books) => (result = books));

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/books`);
    expect(req.request.method).toBe('GET');
    req.flush([sampleBook]);

    expect(result).toEqual([sampleBook]);
  });
});
