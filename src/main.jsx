import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </CookiesProvider>
  </React.StrictMode>
);
