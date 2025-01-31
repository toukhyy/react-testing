import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import ProductList from '../../src/components/ProductList';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';
import { db } from '../mocks/db';
import { simulateAPIDelay } from '../utils';

describe('ProductList', () => {
  const productIds: number[] = [];

  beforeAll(() => {
    for (let i = 0; i <= 2; i++) {
      const { id } = db.product.create();
      productIds.push(id);
    }
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it('should render a list of products', async () => {
    render(<ProductList />);

    const products = await screen.findAllByRole('listitem');

    expect(products.length).toBeGreaterThan(0);
  });

  it('should render a no products available message if the list is empty', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])));

    render(<ProductList />);

    const message = await screen.findByText(/no products/i);

    expect(message).toBeInTheDocument();
  });

  it('should render an error message if the request fails', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    render(<ProductList />);

    const message = await screen.findByText(/error/i);

    expect(message).toBeInTheDocument();
  });

  it('should render a loading message while the request is pending', async () => {
    simulateAPIDelay('/products');

    render(<ProductList />);

    const message = await screen.findByText(/loading/i);

    expect(message).toBeInTheDocument();
  });

  it('should remove the loading message after the request is resolved', async () => {
    render(<ProductList />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });

  it('should remove the loading message after the request fails', async () => {
    server.use(http.get('/products', () => HttpResponse.error()));

    render(<ProductList />);

    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  });
});
