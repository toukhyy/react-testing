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
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
