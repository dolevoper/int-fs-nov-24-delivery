import { useState, type MouseEvent } from "react";
import { TrackOrder } from "./TrackOrder";
import { OrderHistory } from "./OrderHistory";
import { NewOrder } from "./NewOrder";

import styles from "./App.module.scss";

// 1. Create order history page (can still use mock data, but use async function)
// 2. New order page (using a form)
//    * start with hardcoded items in the order page
//    * get items from "server"
// 3. Tie it all together (save orders in local storage)
// 4. Update order details and history to show items' price and total cost etc...

type AppPage =
  | "order-history"
  | "track-order"
  | "new-order";

export function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>("order-history");

  return (
    <>
      <Nav onLinkClick={setCurrentPage} />
      <Main page={currentPage} />
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

type MainProps = { page: AppPage };
function Main({ page }: MainProps) {
  switch (page) {
    case "order-history": return <OrderHistory />;
    case "track-order": return <TrackOrder orderId="225914" />;
    case "new-order": return <NewOrder />;
  }
}
