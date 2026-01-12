// modules/user/address/utils/addressMapper.js
export const ADDRESS_TYPE_MAP = {
  0: "home",
  1: "office",
  home: "home",
  office: "office",
};

export const normalizeAddressType = (type) => ADDRESS_TYPE_MAP[type] || "home";
