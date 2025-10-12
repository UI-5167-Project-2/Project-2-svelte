const dialogIDs = [];

/**
 * @function generateDialogID()
 * @description A dialog id function to organize all dialogs
 * @returns a dialog id
 */
export function generateDialogID() {
  const dialogID = `modal${dialogIDs.length > 0 ? dialogIDs.length : 0}`;
  dialogIDs.push(dialogID);
  return dialogID;
}
