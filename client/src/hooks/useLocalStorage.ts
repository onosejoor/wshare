"use client";

type Props = {
  key: string;
  fileName: string;
};


export function getItems() {
  const items = localStorage.getItem("upload_keys");
  if (items) {
    return { data: JSON.parse(items) as Props[] };
  }
  return { data: [] };
}

export function setItem(data: Props) {
  const items = JSON.parse(localStorage.getItem("upload_keys") || `[]`);
  const jsonString = JSON.stringify([...items, data]);
  localStorage.setItem("upload_keys", jsonString);
}
