import { render, screen } from '@testing-library/react';
import ProductForm from '../../src/components/ProductForm';
import { TestProviders } from '../TestProviders';
import { Category, Product } from '../../src/entities';
import { db } from '../mocks/db';
import userEvent from '@testing-library/user-event';
import { Toaster } from 'react-hot-toast';

function setupComponent(product?: Product) {
  const callback = vi.fn();

  render(
    <>
      <ProductForm product={product} onSubmit={callback} />
      <Toaster />
    </>,

    {
      wrapper: TestProviders,
    }
  );

  return {
    user: userEvent.setup(),
    callback,
  };
}

describe('ProductForm', () => {
  let category: Category;

  beforeAll(() => {
    category = db.category.create();
  });

  afterAll(() => {
    db.category.delete({ where: { id: { equals: category.id } } });
  });

  it('should render product form fields.', async () => {
    setupComponent();

    expect(
      await screen.findByRole('textbox', { name: /name/i })
    ).toBeInTheDocument();

    expect(await screen.findByPlaceholderText(/price/i)).toBeInTheDocument();

    expect(
      await screen.findByRole('combobox', { name: /category/i })
    ).toBeInTheDocument();
  });

  it('should display pre fill form inputs with product data if provided.', async () => {
    const product: Product = {
      id: 1,
      categoryId: category.id,
      price: 1,
      name: 'test product',
    };
    setupComponent(product);

    const name = await screen.findByRole('textbox', { name: /name/i });
    const price = await screen.findByRole('textbox', { name: /price/i });
    const combobox = await screen.findByRole('combobox', { name: /category/i });

    expect(name).toHaveValue(product.name);
    expect(price).toHaveValue(product.price.toString());
    expect(combobox).toHaveTextContent(category.name);
  });

  it.each([
    {
      scenario: 'missing',
      name: undefined,
      message: /required/i,
    },
    {
      scenario: 'longer that 255 chars',
      name: 'a'.repeat(101),
      message: /100/i,
    },
  ])(
    'should display an error if name is $scenario when submitting the form.',
    async ({ name, message }) => {
      const { user } = setupComponent();
      await screen.findByRole('form');

      // enter the name if exists
      const nameInput = screen.getByRole('textbox', { name: /name/i });
      if (name) await user.type(nameInput, name);
      console.log(name?.length);

      // enter a price
      const priceInput = screen.getByRole('textbox', { name: /price/i });
      await user.type(priceInput, '22');

      // select a category
      const comboboxInput = screen.getByRole('combobox', {
        name: /category/i,
      });
      await user.click(comboboxInput);
      const options = screen.getAllByRole('option');
      await user.click(options[0]);

      // submit the form
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);
      const error = screen.queryByRole('alert');

      expect(error).toBeInTheDocument();
      expect(error).toHaveTextContent(message);
    }
  );

  it('should call on submit callback when form is submitted', async () => {
    const { user, callback } = setupComponent();

    const fillData = {
      categoryId: category.id,
      price: 10,
      name: 'test product',
    };

    await screen.findByRole('form');

    const nameInput = screen.getByRole('textbox', { name: /name/i });
    await user.type(nameInput, fillData.name);

    const priceInput = screen.getByRole('textbox', { name: /price/i });
    await user.type(priceInput, fillData.price.toString());

    const comboboxInput = screen.getByRole('combobox', {
      name: /category/i,
    });
    await user.click(comboboxInput);
    const options = screen.getAllByRole('option');
    await user.click(options[0]);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    expect(callback).toHaveBeenCalledWith(fillData);
  });

  it('should display error toast if submission fails', async () => {
    const { user, callback } = setupComponent();
    callback.mockRejectedValue({}); // simulates rejected promise

    const fillData = {
      categoryId: category.id,
      price: 10,
      name: 'test product',
    };

    await screen.findByRole('form');

    const nameInput = screen.getByRole('textbox', { name: /name/i });
    await user.type(nameInput, fillData.name);

    const priceInput = screen.getByRole('textbox', { name: /price/i });
    await user.type(priceInput, fillData.price.toString());

    const comboboxInput = screen.getByRole('combobox', {
      name: /category/i,
    });
    await user.click(comboboxInput);
    const options = screen.getAllByRole('option');
    await user.click(options[0]);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    const errorToast = await screen.findByRole('status');

    expect(errorToast).toBeInTheDocument();
    expect(errorToast).toHaveTextContent(/error/i);
  });
});
