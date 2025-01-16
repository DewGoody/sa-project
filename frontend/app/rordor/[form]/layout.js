
import '../../globals.css';
import { Header } from '../../components/Header';
import { FormDataProvider } from '../../contexts/RDDataContext'; // Adjust the import path as necessary

export const metadata = {
  title: 'Your App Title',
  description: 'Your App Description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        <FormDataProvider>
          {children}
        </FormDataProvider>
      </body>
    </html>
  );
}