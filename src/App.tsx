import "./style/global.less";
import { useState } from "react";
import Login from "./pages/login";
import "@arco-design/web-react/dist/css/arco.css";
import "antd/dist/reset.css";
import PageLayout from "./layout";
import { Route, Routes } from "react-router-dom";
import useStorage from "./utils/useStorage";
import { GlobalContext } from "./context";

function App() {
  const [lang, setLang] = useStorage("arco-lang", "zh-CN");
  const [theme, setTheme] = useStorage("arco-theme", "light");

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme,
  };

  return (
    <>
      <GlobalContext.Provider value={contextValue}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<PageLayout />} />
        </Routes>
      </GlobalContext.Provider>
    </>
  );
}

export default App;
