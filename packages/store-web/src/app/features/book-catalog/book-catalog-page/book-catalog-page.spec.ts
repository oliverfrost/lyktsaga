import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Book } from '@lyktsaga/shared-types';
import { BookCatalogPage } from './book-catalog-page';
import { BooksApiService } from '../data-access/books-api.service';

const books: Book[] = [
  {
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
  },
  {
    id: 'b2',
    title: 'Foundation',
    author: 'Isaac Asimov',
    description: null,
    publisher: 'Gnome Press',
    yearPublished: 1951,
    price: '8.5',
    currency: 'USD',
    isbn: null,
    language: 'en',
    coverImageUrl: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

function setup(booksApi: Partial<BooksApiService>) {
  TestBed.configureTestingModule({
    imports: [BookCatalogPage],
    providers: [{ provide: BooksApiService, useValue: booksApi }],
  });
  return TestBed.createComponent(BookCatalogPage);
}

describe('BookCatalogPage', () => {
  it('renders one card per book returned by the API', async () => {
    const fixture = setup({ getBooks: () => of(books) });
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    const cards = element.querySelectorAll('store-book-card');
    expect(cards.length).toBe(2);
  });

  it('shows an empty message when the API returns no books', async () => {
    const fixture = setup({ getBooks: () => of([]) });
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('No books available yet');
  });

  it('shows an error message when the API call fails', async () => {
    const fixture = setup({
      getBooks: () => throwError(() => new Error('network error')),
    });
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Failed to load books');
  });
});
