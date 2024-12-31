
import '../globals.css';
import { GoldenDataProvider } from '../contexts/GoldenData'; // Adjust the import path as necessary

export const metadata = {
  title: 'Your App Title',
  description: 'Your App Description',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GoldenDataProvider>
          {children}
        </GoldenDataProvider>
      </body>
    </html>
  );
}