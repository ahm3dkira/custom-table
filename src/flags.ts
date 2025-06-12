const ROLES = {
  VIEW: 1,
  ADD: 2,
  EDIT: 4,
  DELETE: 8,
  EXPORT: 16,
  IMPORT: 32,
  UPDATE_STATUS: 64,

  OPTION_0: (2 ** 0) << 8, // 256
  OPTION_1: (2 ** 1) << 8, // 512
  OPTION_2: (2 ** 2) << 8, // 1024
  OPTION_3: (2 ** 3) << 8, // 2048
  OPTION_4: (2 ** 4) << 8, // 4096
  OPTION_5: (2 ** 5) << 8, // 8192
  OPTION_6: (2 ** 6) << 8, // 16384
  OPTION_7: (2 ** 7) << 8 // 32768
};

// For tableProps
// edit[disable otherwise](8), search(4), form(2), table(1)
export const TABLE_PROPS = {
  TABLE: 1, // show on table only
  FORM: 2, // need 8 to be editable
  SEARCH: 4, // show on search component
  EDIT: 8 // enable on edit form
};
// ======================================================= //
// VIEW_ONLY: 1,             // show on table only
// FORM_READ_ONLY: 2,        // show on add form and disable on edit form
// FORM_EDITABLE: 2 & 8      // can be editable on edit form

export const TABLE_FLAGS = TABLE_PROPS;
export default ROLES;
