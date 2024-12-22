import { render, screen } from '@testing-library/react';

import ProductImageGallery from '../../src/components/ProductImageGallery';

describe('ProductImageGallery', () => {
  it('should not render if no images are passed to the component', () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />);

    expect(container).toBeEmptyDOMElement();
    // or expect(container.firstChild).toBeNull();
  });

  it('should render list of images when an array of images is passed', () => {
    const imagesUrls = ['urlOne', 'urlTwo', 'urlThree'];

    render(<ProductImageGallery imageUrls={imagesUrls} />);

    const elements = screen.getAllByRole('img');

    expect(elements).toHaveLength(3);

    imagesUrls.forEach((imageUrl, i) => {
      expect(elements[i]).toHaveAttribute('src', imageUrl);
    });
  });
});
