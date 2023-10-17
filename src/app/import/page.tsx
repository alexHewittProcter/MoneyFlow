"use client";
import { Alert, Button, Card } from "react-bootstrap";
import AppLayout from "../lib/components/layout/AppLayout";
import FileImporter from "./components/file-import";
import EditableTextWithIcon from "./components/editable-text-with-icon";
import AccountsList from "./components/account-list";
import { useState } from "react";
import { Account } from "../lib/types/account";
import readCSV from "../lib/func/readCSV";
import { Transaction } from "../lib/types/transaction";
import { convertDMYtoYMD } from "../lib/func/fetcher";

export const ImportPage = () => {
  const [importSuccess, setImportSuccess] = useState();
  const [importedFile, setImportedFile] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account>();

  const uploadTransations = (transactions: Transaction) => {
    fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setImportedFile();
        setSelectedAccount();
        setImportSuccess(true);
      })
      .catch((error) => {
        console.error("Error:", error);
        setImportSuccess(false);
      });
  };

  const readImportedFile = () => {
    const { _id, label, ...accountObj } = selectedAccount;
    const results = importedFile
      .map((file) => readCSV(file, accountObj))
      .reduce((total, file) => {
        console.log(file);
        return [...total, ...file];
      }, [])
      .map((res) => ({
        ...res,
        account: _id,
        amount: parseFloat(res.price),
        date: convertDMYtoYMD(res.date),
      }));
    console.log(results);
    console.log(results);
    uploadTransations(results);
  };

  return (
    <AppLayout>
      <div>
        <FileImporter onFileImport={setImportedFile} />
        {importedFile && <AccountsList onSelect={setSelectedAccount} />}
        {selectedAccount && (
          <div className="text-center mt-3">
            <Button onClick={readImportedFile}>Import files</Button>
          </div>
        )}

        {importSuccess && (
          <div>
            <Alert>Your statement was successfully imported</Alert>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default ImportPage;
