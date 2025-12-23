// src/navigation/index.js
import { allNavigation } from "./allNavigation";

export const getNavigation = (role) => {
  if (role && allNavigation[role]) {
    return allNavigation[role];
  }
  // console.log(role);

  return [];
};
