import { Theme } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
export const TestProviders = ({ children }: PropsWithChildren) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <Theme>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </Theme>
  );
};
