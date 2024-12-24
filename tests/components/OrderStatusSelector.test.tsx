import { render, screen } from '@testing-library/react';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

const setupComponent = () => {
  render(
    <Theme>
      <OrderStatusSelector onChange={console.log} />
    </Theme>
  );

  return {
    user: userEvent.setup(),
  };
};

describe('OrderStatusSelector', () => {
  it('should render a combobox with the default value: New', () => {
    setupComponent();

    const comboBox = screen.getByRole('combobox');
    expect(comboBox).toHaveTextContent('New');
  });

  it('should open a list of options when the combobox is clicked', async () => {
    const { user } = setupComponent();

    const comboBox = screen.getByRole('combobox');
    await user.click(comboBox);

    const options = screen.getAllByRole('option');
    const optionsLabels = options.map((option) => option.textContent);

    expect(options.length).toBeGreaterThanOrEqual(3);
    expect(optionsLabels).toEqual(['New', 'Processed', 'Fulfilled']);
  });
});
