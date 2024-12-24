import { render, screen } from '@testing-library/react';
import ExpandableText from '../../src/components/ExpandableText';
import userEvent from '@testing-library/user-event';

describe('ExpandableText', () => {
  const longText =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati modi nisi, ducimus pariatur fugit recusandae similique molestiae eveniet reiciendis dolorum assumenda nam voluptatibus, ad dolor minus ex possimus architecto quaerat, quod commodi? Illo beatae sint';

  const truncatedText = longText.substring(0, 255) + '...';

  it('should render full text if the text length is less than 255 chars', () => {
    render(<ExpandableText text="short text" />);

    const text = screen.queryByRole('article');

    expect(text).toBeInTheDocument();
  });

  it('should render truncated text and button to show full text if the text length is greater than 255 chars', () => {
    render(<ExpandableText text={longText} />);

    const text = screen.getByRole('article');
    expect(text).toHaveTextContent(truncatedText);

    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent(/more/i);
  });

  it('should show full text when view more button is clicked', async () => {
    render(<ExpandableText text={longText} />);
    const user = userEvent.setup();

    const btn = screen.getByRole('button');
    await user.click(btn);

    expect(btn).toHaveTextContent(/less/i);
    expect(screen.getByRole('article')).toHaveTextContent(longText);
  });

  it('should truncate text when the show less button is clicked', async () => {
    render(<ExpandableText text={longText} />);
    const user = userEvent.setup();

    const showMoreBtn = screen.getByRole('button', { name: /more/i });
    await user.click(showMoreBtn);

    const showLessBtn = screen.getByRole('button', { name: /less/i });
    await user.click(showLessBtn);

    expect(screen.getByRole('article')).toHaveTextContent(truncatedText);
  });
});
