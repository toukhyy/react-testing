import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { server } from '../mocks/server';
import { delay, http, HttpResponse } from 'msw';
import ProductDetail from '../../src/components/ProductDetail';
import { db } from '../mocks/db';
import { Product } from '../../src/entities';

describe('ProductDetail', () => {
  let product: Product;

  beforeAll(() => {
    product = db.product.create();
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: product.id } } });
  });

  it('should fetch the product with passed product id', async () => {
    render(<ProductDetail productId={product.id} />);

    const productName = await screen.findByText(new RegExp(product.name, 'i'));
    const productPrice = await screen.findByText(
      new RegExp(`\\$${product.price}`, 'i')
    );

    expect(productName).toBeInTheDocument();
    expect(productPrice).toBeInTheDocument();
  });

  it('should render Invalid ProductId message if an invalid productId is passed', async () => {
    server.use(http.get('/products', () => HttpResponse.json([])));

    render(<ProductDetail productId={0} />);

    const message = await screen.findByText(/Invalid ProductId/i);

    expect(message).toBeInTheDocument();
  });

  it('should render a not found message if the product is not found.', async () => {
    server.use(http.get('/products/1', () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/not found/i);

    expect(message).toBeInTheDocument();
  });

  it('should render an error message if the api returns an error.', async () => {
    server.use(http.get('/products/1', () => HttpResponse.error()));

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/error/i);

    expect(message).toBeInTheDocument();
  });

  it('should render a loading indicator until the request is resolved', async () => {
    server.use(
      http.get('/product/1', () => {
        delay('infinite');
      })
    );

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/loading/i);

    expect(message).toBeInTheDocument();
  });

  it('should remove the loading indicator after the request is resolved', async () => {
    render(<ProductDetail productId={product.id} />);

    const message = await screen.findByText(/loading/i);

    waitForElementToBeRemoved(message);
  });

  it('should remove the loading indicator if the request fails', async () => {
    server.use(http.get('/product/1', () => HttpResponse.error()));

    render(<ProductDetail productId={1} />);

    const message = await screen.findByText(/loading/i);

    waitForElementToBeRemoved(message);
  });
});
