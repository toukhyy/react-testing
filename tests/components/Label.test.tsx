import { render, screen } from '@testing-library/react';
import Label from '../../src/components/Label';
import { TestProviders } from '../TestProviders';
import { LanguageProvider } from '../../src/providers/language/LanguageProvider';
import { Language } from '../../src/providers/language/type';

function setupComponent({
  labelId = 'welcome',
  selectedLanguage = 'en',
}: {
  labelId?: string;
  selectedLanguage?: Language;
}) {
  render(
    <LanguageProvider language={selectedLanguage}>
      <Label labelId={labelId} />
    </LanguageProvider>,
    { wrapper: TestProviders }
  );

  const testData = {
    labelId: 'welcome',
    enTranslation: 'Welcome',
    esTranslation: 'Bienvenidos',
  };

  return {
    testData,
  };
}

describe('label', () => {
  it('should display the english translation if english is selected', () => {
    const { testData } = setupComponent({});

    expect(screen.getByText(testData.enTranslation)).toBeInTheDocument();
  });

  it('should display the spanish translation if spanish is selected', () => {
    const { testData } = setupComponent({ selectedLanguage: 'es' });

    expect(screen.getByText(testData.esTranslation)).toBeInTheDocument();
  });

  it('should display an error message if label id not found', () => {
    const { testData } = setupComponent({});

    expect(screen.getByText(testData.enTranslation)).toBeInTheDocument();
  });

  it('should display the spanish translation if spanish is selected', () => {
    expect(() =>
      setupComponent({
        labelId: 'wrongLabelId!',
        selectedLanguage: 'es',
      })
    ).toThrowError();
  });
});
