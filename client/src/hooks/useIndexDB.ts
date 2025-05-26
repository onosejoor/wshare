"use client";

import { openDB } from "idb";
import { deleteAll, getItems } from "./useLocalStorage";

type Props = {
  key: string;
  fileName: string;
};

const DB_NAME = "wshareKeysDB";
const STORE_NAME = "upload_keys";

async function dbPromise() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    },
  });
}

export async function getIDItems() {
  const { data } = getItems();
  if (data.length > 0) {
    setAll(data);
  }
  deleteAll();
  const db = await dbPromise();
  const all = (await db.getAll(STORE_NAME)) as Props[];

  return { data: all };
}

export async function setIDItem(data: Props) {
  const db = await dbPromise();
  await db.put(STORE_NAME, data);
}

export async function deleteIDItem(key: string) {
  const db = await dbPromise();
  await db.delete(STORE_NAME, key);
  const remaining = (await db.getAll(STORE_NAME)) as Props[];
  return { newData: remaining };
}

async function setAll(data: Props[]) {
  const db = await dbPromise();

  for (const obj of data) {
    await db.put(STORE_NAME, obj);
  }
  return;
}
