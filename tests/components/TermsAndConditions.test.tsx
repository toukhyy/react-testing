import { render, screen } from '@testing-library/react';
import TermsAndConditions from '../../src/components/TermsAndConditions';
import userEvent from '@testing-library/user-event';

describe('Terms and Conditions', () => {
  it('should display a heading, check box and disabled submit button', () => {
    render(<TermsAndConditions />);
    const heading = screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/terms & conditions/i);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();

    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
  });

  it('should enable the button when the checkbox is clicked', async () => {
    render(<TermsAndConditions />);
    const user = userEvent.setup();

    // Act
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    // Assertion
    const submitBtn = screen.getByRole('button', { name: 'Submit' });
    expect(submitBtn).toBeEnabled();
  });
});
