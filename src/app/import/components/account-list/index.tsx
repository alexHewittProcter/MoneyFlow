import { Account } from "lib/app/lib/types/account";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Button } from "react-bootstrap";
import useSWR from "swr";
import classNames from "classnames";

import EditableTextWithIcon from "../editable-text-with-icon";
import { fetcher } from "lib/app/lib/func/fetcher";

import styles from "./styles.module.scss";

const baseObj = {
  label: "",
  name: "",
  price: "",
  ref: "",
  date: "",
};

interface AccountCardProps {
  account?: Account;
  onAccountUpdate?: (updatedAccount: Account) => void;
  onAdd?: (account: Account) => void;
  onSelect?: (account: Account) => void;
  selected?: boolean;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  onAccountUpdate,
  onAdd,
  onSelect = () => {},
  selected = false,
}) => {
  const [isEdited, setIsEdited] = useState(false);
  const [localAccount, setLocalAccount] = useState(account || baseObj);

  useEffect(() => {
    if (account) {
      setLocalAccount(account);
    }
  }, [account]);

  const handleChange = (key: keyof Account, newValue: string) => {
    setLocalAccount({
      ...localAccount,
      [key]: newValue,
    });
    setIsEdited(true);
  };

  const handleSave = () => {
    if (onAdd && !account) {
      onAdd(localAccount);
    } else if (onAccountUpdate && account) {
      onAccountUpdate(localAccount);
    }
    setIsEdited(false);
    setLocalAccount(baseObj);
  };

  return (
    <Card
      className={classNames(styles.accountCard, {
        // [styles.selected]: selected,
      })}
      bg={selected ? "primary" : "light"}
      onClick={() => account && onSelect(account)}
    >
      <Card.Body>
        {!account && !isEdited && (
          <div className="text-center">
            <i className="bi-plus-lg"></i> Add New
          </div>
        )}
        <EditableTextWithIcon
          text={localAccount.label}
          onChange={(text) => handleChange("label", text)}
          placeholder="Label"
        />
        <EditableTextWithIcon
          text={localAccount.name}
          onChange={(text) => handleChange("name", text)}
          placeholder="Name"
        />
        <EditableTextWithIcon
          text={localAccount.price}
          onChange={(text) => handleChange("price", text)}
          placeholder="Price"
        />
        <EditableTextWithIcon
          text={localAccount.ref}
          onChange={(text) => handleChange("ref", text)}
          placeholder="Ref"
        />
        <EditableTextWithIcon
          text={localAccount.date}
          onChange={(text) => handleChange("date", text)}
          placeholder="Date"
        />
        {isEdited && (
          <div>
            <Button variant="success" onClick={handleSave}>
              <i className="bi-check-lg"></i>
            </Button>
            <Button variant="danger" onClick={() => setIsEdited(false)}>
              <i className="bi-x-lg"></i>
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export interface AccountListProps {
  onSelect: (account: Account) => void;
}

export const AccountsList = (props: AccountListProps) => {
  const { onSelect } = props;
  const [selectedAccount, setSelectedAccount] = useState<Account>();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const selectAccount = (account: Account) => {
    setSelectedAccount({ ...account });
    onSelect(account);
  };

  const { data, error, isLoading } = useSWR(["api/account"], fetcher);

  useEffect(() => {
    if (data && data.accounts) {
      setAccounts(data.accounts);
    }
  }, [data]);

  const addAccount = (account: Account) => {
    fetch("/api/account", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const updateAccount = (account: Account) => {
    fetch("/api/account", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className={styles.accountList}>
      {accounts.map((account, id) => (
        <AccountCard
          key={id}
          account={account}
          onAccountUpdate={updateAccount}
          onSelect={selectAccount}
          selected={JSON.stringify(selectedAccount) === JSON.stringify(account)}
        />
      ))}
      <AccountCard onAdd={addAccount} />
    </div>
  );
};

export default AccountsList;
