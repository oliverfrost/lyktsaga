import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Book } from '@lyktsaga/shared-types';
import { BookCard } from '../book-card/book-card';
import { BooksApiService } from '../data-access/books-api.service';

@Component({
  selector: 'store-book-catalog-page',
  imports: [BookCard],
  templateUrl: './book-catalog-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCatalogPage {
  private readonly booksApi = inject(BooksApiService);

  booksResource = rxResource({
    stream: () => this.booksApi.getBooks(),
    defaultValue: [] as Book[],
  });
}
