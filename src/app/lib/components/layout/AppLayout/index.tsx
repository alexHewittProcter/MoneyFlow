import React, { PropsWithChildren } from "react";
import SideBar, { NavLink } from "../Sidebar";
import Head from "next/head";

import styles from "./styles.module.scss";
import { Button } from "react-bootstrap";

// const SideBar = () => (
//   <div>
//     {/* Your sidebar content goes here */}
//     <h2>SideBar</h2>
//     <ul>
//       <li>Item 1</li>
//       <li>Item 2</li>
//       <li>Item 3</li>
//     </ul>
//   </div>
// );

const navLinks: NavLink[] = [
  { href: "/import", label: "Import statements" },
  { href: "/", label: "Timeframe" },
  { href: "/checkbook", label: "Checkbook" },
];

const AppLayout = ({ children }: PropsWithChildren) => (
  <div style={{ display: "flex" }} className={styles.appLayoutContainer}>
    <Head>
      <title>MoneyFlow</title>
    </Head>
    <SideBar navLinks={navLinks} />
    <div className={styles.pageWrapper}>
      <div className={styles.page}>{children}</div>
    </div>
  </div>
);

export default AppLayout;
