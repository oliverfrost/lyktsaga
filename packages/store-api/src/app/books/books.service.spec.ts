import { ConflictException, NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';

function createPrismaMock() {
  return {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
}

const sampleBook = {
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
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('BooksService', () => {
  let prisma: ReturnType<typeof createPrismaMock>;
  let service: BooksService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new BooksService(prisma as never);
  });

  describe('findAll', () => {
    it('returns every book from the database', async () => {
      prisma.book.findMany.mockResolvedValue([sampleBook]);

      const result = await service.findAll();

      expect(result).toEqual([sampleBook]);
    });
  });

  describe('findOne', () => {
    it('returns the book when it exists', async () => {
      prisma.book.findUnique.mockResolvedValue(sampleBook);

      const result = await service.findOne('b1');

      expect(result).toEqual(sampleBook);
    });

    it('throws NotFoundException when the book does not exist', async () => {
      prisma.book.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('creates and returns the new book', async () => {
      prisma.book.create.mockResolvedValue(sampleBook);

      const result = await service.create({
        title: 'Dune',
        author: 'Frank Herbert',
        publisher: 'Chilton Books',
        yearPublished: 1965,
        price: 9.99,
      });

      expect(result).toEqual(sampleBook);
    });

    it('throws ConflictException when the ISBN is already in use', async () => {
      prisma.book.create.mockRejectedValue({ code: 'P2002' });

      await expect(
        service.create({
          title: 'Dune',
          author: 'Frank Herbert',
          publisher: 'Chilton Books',
          yearPublished: 1965,
          price: 9.99,
          isbn: 'duplicate',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('updates and returns the book', async () => {
      prisma.book.update.mockResolvedValue({
        ...sampleBook,
        title: 'Dune (revised)',
      });

      const result = await service.update('b1', { title: 'Dune (revised)' });

      expect(result.title).toBe('Dune (revised)');
    });

    it('throws NotFoundException when the book does not exist', async () => {
      prisma.book.update.mockRejectedValue({ code: 'P2025' });

      await expect(service.update('missing', { title: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws ConflictException when the ISBN is already in use', async () => {
      prisma.book.update.mockRejectedValue({ code: 'P2002' });

      await expect(service.update('b1', { isbn: 'duplicate' })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('remove', () => {
    it('deletes the book', async () => {
      prisma.book.delete.mockResolvedValue(sampleBook);

      await service.remove('b1');

      expect(prisma.book.delete).toHaveBeenCalledWith({ where: { id: 'b1' } });
    });

    it('throws NotFoundException when the book does not exist', async () => {
      prisma.book.delete.mockRejectedValue({ code: 'P2025' });

      await expect(service.remove('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
