import axios from 'axios';

describe('Books', () => {
  const createPayload = {
    title: 'Dune',
    author: 'Frank Herbert',
    publisher: 'Chilton Books',
    yearPublished: 1965,
    price: 9.99,
  };

  it('creates a book', async () => {
    const res = await axios.post('/api/v1/books', createPayload);

    expect(res.status).toBe(201);
    expect(res.data).toMatchObject({ ...createPayload, price: '9.99' });
    expect(res.data.id).toEqual(expect.any(String));
  });

  it('rejects an invalid payload', async () => {
    await expect(
      axios.post('/api/v1/books', { title: 'Missing everything else' }),
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it('lists books including a newly created one', async () => {
    const created = await axios.post('/api/v1/books', createPayload);

    const res = await axios.get('/api/v1/books');

    expect(res.status).toBe(200);
    expect(res.data.map((b: { id: string }) => b.id)).toContain(
      created.data.id,
    );
  });

  it('gets a single book by id', async () => {
    const created = await axios.post('/api/v1/books', createPayload);

    const res = await axios.get(`/api/v1/books/${created.data.id}`);

    expect(res.status).toBe(200);
    expect(res.data.id).toBe(created.data.id);
  });

  it('returns 404 for a missing book', async () => {
    await expect(
      axios.get('/api/v1/books/00000000-0000-0000-0000-000000000000'),
    ).rejects.toMatchObject({ response: { status: 404 } });
  });

  it('updates a book', async () => {
    const created = await axios.post('/api/v1/books', createPayload);

    const res = await axios.patch(`/api/v1/books/${created.data.id}`, {
      price: 12.5,
    });

    expect(res.status).toBe(200);
    expect(res.data.price).toBe('12.5');
  });

  it('deletes a book', async () => {
    const created = await axios.post('/api/v1/books', createPayload);

    const del = await axios.delete(`/api/v1/books/${created.data.id}`);
    expect(del.status).toBe(204);

    await expect(
      axios.get(`/api/v1/books/${created.data.id}`),
    ).rejects.toMatchObject({ response: { status: 404 } });
  });
});
