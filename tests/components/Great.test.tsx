import { render, screen } from '@testing-library/react';
import Greet from '../../src/components/Greet';

describe('Great', () => {
  it('should render hello `name`, if name os provided', () => {
    render(<Greet name="John" />);

    const heading = screen.getByRole('heading');

    expect(heading).toHaveTextContent('Hello John');

    expect(heading).toHaveTextContent(/John/i);
  });

  it('should render login button, if name not provided', () => {
    render(<Greet />);

    const btn = screen.getByRole('button');

    expect(btn).toBeInTheDocument();

    expect(btn).toHaveTextContent('Login');
  });
});
