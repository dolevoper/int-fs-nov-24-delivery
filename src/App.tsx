import { useState } from "react";
import { TrackOrder } from "./TrackOrder";
import { HandleOrder } from "./HandleOrder";
import { LogIn } from "./LogIn";


export function App() {
  const [currentOrderId, setCurrentOrderId] = useState("112335");
  const [currPage, setCurrentPage] = useState("TrackOrder");
  const [loading, setLoading] = useState(false);

  const renderPage = () => {
    switch (currPage) {
      case "TrackOrder":
        return <TrackOrder orderId={currentOrderId} setLoading={setLoading}/>;
      case "HandleOrders":
        return <HandleOrder orderId={currentOrderId} setLoading={setLoading} loading={loading}/>;    
      case "LogIn":
        return <LogIn />;   
    }
  };

  return (
    <>
      <menu>
        <button disabled={loading} onClick={() => setCurrentOrderId("112335")}>112335</button>
        <button disabled={loading} onClick={() => setCurrentOrderId("225914")}>225914</button>
        <button disabled={loading} onClick={() => setCurrentOrderId("658891")}>658891</button>
        <button disabled={loading} onClick={() => setCurrentOrderId("404")}>404</button>
        <button disabled={loading} onClick={() => setCurrentPage("TrackOrder")}>Track Order</button>
        <button disabled={loading} onClick={() => setCurrentPage("HandleOrders")}>HandleOrders</button>
        <button disabled={loading} onClick={() => setCurrentPage("LogIn")}>Log In</button>
      </menu>
      {renderPage()}
    </>
  );
}
