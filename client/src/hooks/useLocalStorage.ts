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

export function deleteItem(key: Props["key"]) {
  const items = JSON.parse(
    localStorage.getItem("upload_keys") || `[]`
  ) as Props[];
  const removeFileFromLS = items.filter(({ key: k }) => k !== key);
  const jsonString = JSON.stringify(removeFileFromLS);
  localStorage.setItem("upload_keys", jsonString);

  return {newData : removeFileFromLS};
}
