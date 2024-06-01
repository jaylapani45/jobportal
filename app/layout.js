// This file sets the layout for your application
import { Providers } from './providers';
import Layout from './components/Layout';

export default function RootLayout({ children }) {
  return (
    <html>
      <head />
      <body>
        <Providers>
          <Layout>
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  );
}
