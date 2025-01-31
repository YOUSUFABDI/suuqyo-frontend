import { useSelector } from 'react-redux';
import { RootState } from 'src/store';

// ----------------------------------------------------------------------

export function useAuth() {
  const { token, email, role, loading } = useSelector((state: RootState) => state.auth);

  return {
    authenticated: Boolean(token),
    token,
    email,
    role,
    loading,
  };
}
