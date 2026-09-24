import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Book } from '@lyktsaga/shared-types';

const PLACEHOLDER_COVER = 'book-cover-placeholder.svg';

@Component({
  selector: 'store-book-card',
  templateUrl: './book-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookCard {
  book = input.required<Book>();

  coverImageUrl = computed(
    () => this.book().coverImageUrl ?? PLACEHOLDER_COVER,
  );

  formattedPrice = computed(() => {
    const b = this.book();
    return `${b.price} ${b.currency}`;
  });
}
