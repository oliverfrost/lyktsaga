import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Book } from '@lyktsaga/shared-types';
import { BookCard } from './book-card';

const book: Book = {
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

describe('BookCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCard],
    }).compileComponents();
  });

  it('renders the title, author and price', async () => {
    const fixture = TestBed.createComponent(BookCard);
    fixture.componentRef.setInput('book', book);
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Dune');
    expect(text).toContain('Frank Herbert');
    expect(text).toContain('9.99');
  });

  it('shows the placeholder image when coverImageUrl is missing', async () => {
    const fixture = TestBed.createComponent(BookCard);
    fixture.componentRef.setInput('book', book);
    await fixture.whenStable();

    const img = fixture.debugElement.query(By.css('img'))
      .nativeElement as HTMLImageElement;
    expect(img.src).toContain('book-cover-placeholder.svg');
  });

  it('shows the cover image when coverImageUrl is present', async () => {
    const fixture = TestBed.createComponent(BookCard);
    fixture.componentRef.setInput('book', {
      ...book,
      coverImageUrl: 'https://example.com/dune.jpg',
    });
    await fixture.whenStable();

    const img = fixture.debugElement.query(By.css('img'))
      .nativeElement as HTMLImageElement;
    expect(img.src).toBe('https://example.com/dune.jpg');
  });
});
