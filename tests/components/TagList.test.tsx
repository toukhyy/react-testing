import { render, screen } from '@testing-library/react';
import TagList from '../../src/components/TagList';

describe('TagList', () => {
  it('should render tag list', async () => {
    render(<TagList />);

    // await waitFor(() => {
    //   const tags = screen.getAllByRole('listitem');
    //   expect(tags.length).toBeGreaterThan(0);
    // });

    const tags = await screen.findAllByRole('listitem');
    expect(tags.length).toBeGreaterThan(0);
  });
});
