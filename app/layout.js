import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Online Job Starter Kit — Dashboard",
  description: "Your remote career command center",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
