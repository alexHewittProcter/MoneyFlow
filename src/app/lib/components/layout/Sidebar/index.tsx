import React, { useState } from "react";
import styles from "./styles.module.scss";
import classNames from "classnames";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { Button, Nav, NavItem, NavLink } from "react-bootstrap";

export interface NavLink {
  href: string;
  label: string;
}

interface SideBarProps {
  navLinks: NavLink[];
}

const SideBar: React.FC<SideBarProps> = ({ navLinks = [] }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    // console.log("TOGGELD");
  };

  // console.log("BAHHH", toggleSidebar);

  // console.log(isOpen);

  const ToggleButton = () => (
    <Button variant="link" onClick={toggleSidebar}>
      <i className="bi bi-border-width"></i>
    </Button>
  );

  const RenderItem = (props: { href: string; label: string }) => {
    const { href, label } = props;
    return (
      <React.Fragment key={label}>
        <NavItem>
          <NavLink href={href}>{label}</NavLink>
        </NavItem>
      </React.Fragment>
    );
  };

  return (
    <div className="d-flex flex-row">
      <div
        className={classNames("flex-column flex-shrink-0 p-3", styles.sidebar, {
          [styles.hidden]: !isOpen,
        })}
      >
        <div className={styles.mobileToggle}>
          <ToggleButton />
        </div>
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-black text-decoration-none"
        >
          {/* <svg className="bi pe-none me-2" width="40" height="32">
            <use xlinkHref="#bootstrap" />
          </svg> */}
          {/* <i className="bi-bootstrap-reboot" /> */}
          <span className="fs-4">ThoughtStorm</span>
        </a>
        <hr />
        <Nav variant="underline" className="flex-column text-light mb-auto">
          {navLinks.map(RenderItem)}
        </Nav>
        <hr />
        <div className="dropdown dropup">
          <a
            href="#"
            className="d-flex align-items-center text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="https://github.com/mdo.png"
              alt=""
              width="32"
              height="32"
              className="rounded-circle me-2"
            />
            <strong>mdo</strong>
          </a>
          <ul className="dropdown-menu dropdown-menu-dark text-small shadow">
            <li>
              <a className="dropdown-item" href="#">
                New project...
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Settings
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Profile
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Sign out
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={classNames(styles.toggleContainer, {
          [styles.hidden]: !isOpen,
        })}
      >
        <ToggleButton />
      </div>
      <div
        className={classNames(styles.mobileMenuShadow, {
          [styles.hidden]: !isOpen,
        })}
      ></div>
    </div>
  );
};

export default SideBar;
