import React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { ethers } from "ethers";
import { logo } from "./assets";
import { Home, CreatePost } from "./pages";
import Navigation from "./components/Navigation";

const App = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);
  };

  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <BrowserRouter>
      <header className="w-full flex justify-between items-center bg-black sm:px-8 py-3/4 border-b border-b-[#e6ebf4] ">
        {" "}
        <Link to="/">
          <img src={logo} alt="logo" className="w-28 object-contain" />
        </Link>
        <Link
          to="/create-post"
          className="font-inter font-medium bg-[#64ffe5] text-black px-4 py-2 rounded-md"
        >
          {" "}
          Create
        </Link>
        <div>
          <button className="font-inter font-medium bg-[#64ffe5] text-black px-4 py-2 rounded-md">
            <Navigation account={account} setAccount={setAccount} />
          </button>
        </div>
      </header>
      <main className=" sm:p-8 px-4 py-8 w-full bg-[#c6f5f1] min-h-[calc(100vh-73px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </main>
      <footer className="text-center p-3 bg-black text-white">
        Made with{" "}
        <span role="img" aria-label="heart">
          ❤️
        </span>{" "}
        by
        <a
          href="https://www.linkedin.com/in/aaryan-sharma-220465195/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {" "}
          aaryan
        </a>
      </footer>
    </BrowserRouter>
  );
};

export default App;
