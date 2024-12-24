import { render, screen } from '@testing-library/react';
import ToastDemo from '../../src/components/ToastDemo';
import { Toaster } from 'react-hot-toast';
import userEvent from '@testing-library/user-event';

describe('ToastDemo', () => {
  it('should render a success toast when button is clicked', async () => {
    render(
      <>
        <Toaster />
        <ToastDemo />
      </>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    const toasts = await screen.findAllByText(/success/i);
    expect(toasts.length).toBeGreaterThan(0);
  });
});
