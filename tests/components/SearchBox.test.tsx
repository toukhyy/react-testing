import { render, screen } from '@testing-library/react';
import SearchBox from '../../src/components/SearchBox';
import userEvent from '@testing-library/user-event';

const setupComponent = () => {
  const onChangeMock = vi.fn();
  const renderObj = render(<SearchBox onChange={onChangeMock} />);

  return {
    user: userEvent.setup(),
    onChangeMock,
    ...renderObj,
  };
};

describe('SearchBox', () => {
  it('should render a search text box', () => {
    setupComponent();

    const input = screen.queryByPlaceholderText(/search/i);

    expect(input).toBeInTheDocument();
  });

  it('should update the search term when user types in the text box', async () => {
    const { user } = setupComponent();

    const input = screen.getByRole('textbox');

    await user.type(input, 'testing');

    expect(input).toHaveValue('testing');
  });

  it('should call the provided onChange function when user types in the text box and click enter', async () => {
    const { user, onChangeMock } = setupComponent();
    const searchTerm = 'testing';

    const input = screen.getByRole('textbox');
    await user.type(input, searchTerm + '{enter}');

    expect(onChangeMock).toHaveBeenCalledWith(searchTerm);
  });

  it('should not call the provided onChange function when the text box is empty', async () => {
    const { user, onChangeMock } = setupComponent();

    const input = screen.getByRole('textbox');
    await user.type(input, '{enter}');

    expect(input).toHaveValue('');
    expect(onChangeMock).not.toHaveBeenCalled();
  });
});
