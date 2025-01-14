// as default is served as "use server"

import { MainContent } from "./mainContent";

// import Image from "next/image";

export const Header = () => {
  return <h1>Header</h1>;
};

// footer
export const Footer = () => {
  return <footer>Footer</footer>;
};

export default function Home() {
  return (
    <>
      <MainContent />
    </>
  );
}
