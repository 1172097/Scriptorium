import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/NavBar";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-primary)] text-[var(--text-primary)]">
      <Navbar />
      <main className="flex-grow p-6">
        <Component {...pageProps} />
      </main>
    </div>
  );
};

export default App;