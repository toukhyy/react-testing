import { useAuth0 } from '@auth0/auth0-react';
import { AuthState } from '@auth0/auth0-react/dist/auth-state';
import { PropsWithChildren, ReactNode } from 'react';

// used for mocking the auth0 library module.
export const auth0Factory = {
  useAuth0: vi.fn().mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
    user: undefined,
  }),
  Auth0Provider: ({ children }: PropsWithChildren) => children,
  withAuthenticationRequired: (component: ReactNode) => component,
};

// to be used in tests to mock the auth state.
export function mockAuthState(authState: AuthState) {
  vi.mocked(useAuth0).mockReturnValue({
    ...authState,
    getAccessTokenSilently: vi.fn().mockResolvedValue('mock-access-token'),
    getAccessTokenWithPopup: vi.fn(),
    getIdTokenClaims: vi.fn(),
    loginWithRedirect: vi.fn(),
    loginWithPopup: vi.fn(),
    logout: vi.fn(),
    handleRedirectCallback: vi.fn(),
  });
}
