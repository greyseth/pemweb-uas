import "./assets/css/App.css";

import { faCity } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PopupContainer from "./components/PopupContainer";
import GlobalLoading from "./assets/css/components/global_Loading";

function App() {
  return (
    <>
      <p>Hello, World</p>
      <GlobalLoading error={false} complete={true} />
    </>
  );
}

export default App;
