import { render, screen } from '@testing-library/react';

import UserAccount from '../../src/components/UserAccount';
import { User } from '../../src/entities';

const mockAdmin: User = {
  id: 1,
  name: 'John Doe',
  isAdmin: true,
};

const mockUser: User = {
  id: 1,
  name: 'John Doe',
  isAdmin: false,
};

describe('UserAccount', () => {
  it('should render user name', () => {
    render(<UserAccount user={mockAdmin} />);

    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
  });

  it('should render user profile with edit button if user is admin', () => {
    render(<UserAccount user={mockAdmin} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
  });

  it('should render user profile without edit button if user is not an admin', () => {
    render(<UserAccount user={mockUser} />);
    const btn = screen.queryByRole('button');
    expect(btn).not.toBeInTheDocument();
  });
});
