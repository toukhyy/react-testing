import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import BrowseProductsPage from '../../src/pages/BrowseProductsPage';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';
import { Category, Product } from '../../src/entities';
import { db } from '../mocks/db';
import { CartProvider } from '../../src/providers/CartProvider';
import { simulateAPIDelay, simulateAPIError } from '../utils';

const setupComponent = () => {
  const user = userEvent.setup();
  render(
    <Theme>
      <CartProvider>
        <BrowseProductsPage />
      </CartProvider>
    </Theme>
  );

  return {
    user,
  };
};

describe('BrowseProductsPage', () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    for (let i = 0; i < 2; i++) {
      const category = db.category.create({ name: 'category' + i });
      categories.push(category);
      products.push(db.product.create({ categoryId: category.id }));
    }
  });
  afterAll(() => {
    db.category.deleteMany({
      where: { id: { in: categories.map((c) => c.id) } },
    });
    db.product.deleteMany({
      where: { id: { in: products.map((p) => p.id) } },
    });
  });

  it('should show a loading indicator while fetching categories only', async () => {
    simulateAPIDelay('/categories');
    setupComponent();

    const loadingSkeleton = screen.getByRole('progressbar', {
      name: 'categories-skeleton',
    });

    expect(loadingSkeleton).toBeInTheDocument();

    await waitForElementToBeRemoved(loadingSkeleton);
  });

  it('should show a loading indicators for each table row while fetching products only', async () => {
    simulateAPIDelay('/products');
    setupComponent();

    const nameLoadingSkeletons = screen.getAllByRole('progressbar', {
      name: 'name-loading-skeleton',
    });
    const priceLoadingSkeletons = screen.getAllByRole('progressbar', {
      name: 'price-loading-skeleton',
    });
    const cartLoadingSkeletons = screen.getAllByRole('progressbar', {
      name: 'cart-loading-skeleton',
    });

    expect(nameLoadingSkeletons.length).toBeGreaterThan(0);
    expect(priceLoadingSkeletons.length).toBeGreaterThan(0);
    expect(cartLoadingSkeletons.length).toBeGreaterThan(0);

    await waitForElementToBeRemoved([
      ...nameLoadingSkeletons,
      ...priceLoadingSkeletons,
      ...cartLoadingSkeletons,
    ]);
  });

  it('should render an error message if fetching categories fails', async () => {
    simulateAPIError('/categories');
    setupComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole('progressbar', {
        name: 'categories-skeleton',
      })
    );

    expect(screen.queryByText(/error/i)).toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('should render an error message if fetching products fails', async () => {
    simulateAPIError('/products');

    setupComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it('should render a list of categories', async () => {
    const { user } = setupComponent();

    const combobox = await screen.findByRole('combobox');
    await user.click(combobox);

    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    categories.forEach((category) => {
      expect(
        screen.getByRole('option', { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it('should render a list of products', async () => {
    setupComponent();

    for (const product of products) {
      expect(
        await screen.findByRole('cell', { name: product.name })
      ).toBeInTheDocument();
    }
  });

  it('should render all products if the selected category is All', async () => {
    const { user } = setupComponent();
    const products = db.product.getAll();

    const combobox = await screen.findByRole('combobox');
    await user.click(combobox);
    const option = screen.getByRole('option', { name: /all/i });
    await user.click(option);

    products.forEach((product) => {
      expect(screen.queryByText(product.name)).toBeInTheDocument();
    });
  });

  it('should filter products based on the selected category', async () => {
    const { user } = setupComponent();
    const selectedCategory = categories[0];
    const products = db.product.findMany({
      where: { categoryId: { equals: selectedCategory.id } },
    });

    const combobox = await screen.findByRole('combobox');
    await user.click(combobox);
    const option = screen.getByRole('option', { name: selectedCategory.name });
    await user.click(option);

    products.forEach((product) => {
      expect(screen.queryByText(product.name)).toBeInTheDocument();
    });
  });
});
