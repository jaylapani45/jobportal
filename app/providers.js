// This file sets up all your context providers
import { AuthProvider } from './components/context/AuthContext';
import { JobProvider } from './components/context/JobContext';
import { HireProvider } from './components/context/HireContext';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <JobProvider>
        <HireProvider>
          {children}
        </HireProvider>
      </JobProvider>
    </AuthProvider>
  );
}
