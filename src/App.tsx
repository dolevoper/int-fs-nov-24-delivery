import { useState, type MouseEvent } from "react";
import { TrackOrder } from "./pages/TrackOrder";
import { OrderHistory } from "./pages/OrderHistory";
import { NewOrder } from "./pages/NewOrder";

import styles from "./App.module.scss";

// 1. Create order history page (can still use mock data, but use async function)
// 2. New order page (using a form)
//    * start with hardcoded items in the order page
//    * get items from "server"
// 3. Tie it all together (save orders in local storage)
// 4. Update order details and history to show items' price and total cost etc...
// 5. Implement generic useAsync hook
// 6. Solve prop-drilling and synced states problem??

type AppPage =
  | "order-history"
  | "track-order"
  | "new-order";

export function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>("order-history");
  const [currentOrderId, setCurrentOrderId] = useState<string>();

  return (
    <>
      <Nav onLinkClick={setCurrentPage} />
      <Main
        page={currentPage}
        setPage={setCurrentPage}
        currentOrderId={currentOrderId}
        setCurrentOrderId={setCurrentOrderId}
      />
    </>
  );
}

type NavProps = { onLinkClick: (page: AppPage) => void };
function Nav({ onLinkClick }: NavProps) {
  const navTo = (page: AppPage) => (e: MouseEvent) => {
    e.preventDefault();
    onLinkClick(page);
  };

  return (
    <nav>
      <menu className={styles.appNav}>
        <li><a href="#" onClick={navTo("order-history")}>Order history</a></li>
        <li><a href="#" onClick={navTo("new-order")}>New order</a></li>
      </menu>
    </nav>
  );
}

type MainProps = {
  page: AppPage,
  setPage: (page: AppPage) => void,
  currentOrderId?: string,
  setCurrentOrderId: (id?: string) => void;
};
function Main({ page, setPage, currentOrderId, setCurrentOrderId }: MainProps) {
  switch (page) {
    case "order-history": return <OrderHistory onSeeDetailsClick={(id) => {
      setPage("track-order");
      setCurrentOrderId(id);
    }} />;
    case "track-order":
      if (!currentOrderId) {
        return <p>error</p>;
      }

      return <TrackOrder orderId={currentOrderId} />;
    case "new-order": return <NewOrder />;
  }
}
