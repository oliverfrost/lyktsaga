/**
 * Wire shape of a Book as returned by store-api's REST endpoints.
 * `price` is a string because Prisma's Decimal type serializes to a
 * string over JSON, not a number.
 */
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  publisher: string;
  yearPublished: number;
  price: string;
  currency: string;
  isbn: string | null;
  language: string;
  coverImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
