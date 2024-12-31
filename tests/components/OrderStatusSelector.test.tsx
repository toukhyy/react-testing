import { render, screen } from '@testing-library/react';
import OrderStatusSelector from '../../src/components/OrderStatusSelector';
import { Theme } from '@radix-ui/themes';
import userEvent from '@testing-library/user-event';

const setupComponent = () => {
  const onChangeMock = vi.fn();

  render(
    <Theme>
      <OrderStatusSelector onChange={onChangeMock} />
    </Theme>
  );

  return {
    user: userEvent.setup(),
    onChangeMock,
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

  it.each([
    { label: /processed/i, value: 'processed' },
    { label: /fulfilled/i, value: 'fulfilled' },
  ])(
    'should select an $label option when it is clicked and trigger onChange',
    async ({ label, value }) => {
      const { user, onChangeMock } = setupComponent();

      const comboBox = screen.getByRole('combobox');
      await user.click(comboBox);
      const option = screen.getByText(label);
      await user.click(option);

      expect(comboBox).toHaveTextContent(label);
      expect(onChangeMock).toHaveBeenCalledWith(value);
    }
  );
});
