import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@lyktsaga/data';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

function isPrismaErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === code
  );
}

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.book.findMany();
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({ where: { id } });

    if (!book) {
      throw new NotFoundException(`Book ${id} not found`);
    }

    return book;
  }

  async create(dto: CreateBookDto) {
    try {
      return await this.prisma.book.create({ data: dto });
    } catch (error) {
      if (isPrismaErrorCode(error, 'P2002')) {
        throw new ConflictException(
          `A book with ISBN ${dto.isbn} already exists`,
        );
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateBookDto) {
    try {
      return await this.prisma.book.update({ where: { id }, data: dto });
    } catch (error) {
      if (isPrismaErrorCode(error, 'P2025')) {
        throw new NotFoundException(`Book ${id} not found`);
      }
      if (isPrismaErrorCode(error, 'P2002')) {
        throw new ConflictException(
          `A book with ISBN ${dto.isbn} already exists`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.book.delete({ where: { id } });
    } catch (error) {
      if (isPrismaErrorCode(error, 'P2025')) {
        throw new NotFoundException(`Book ${id} not found`);
      }
      throw error;
    }
  }
}
