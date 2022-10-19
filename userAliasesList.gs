/* 
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
This script was modified from the one found at https://xfanatical.com/blog/list-users-with-email-aliases-in-google-workspace/ so instead of showing the results
in the console log section they are inserted into a Google Sheet for better management. Including their license as required for usage.
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

 * Usage:
 * For this to be functional the 'Admin API' will have to be added from the 'Service' section as 'AdminDirectory'
 * 1. copy and paste this source code to your Apps Script Editor
 * 2. select the following function name
 * 3. click 'Run'.
 * 4. The users with email aliases will be printed in the 'Execution log'
 *
 * © 2021 xFanatical, Inc.
 * @license MIT
 */

function onOpen(e) {
  let subMenu = [{ name: "Get List", functionName: "listUsersWithEmailAliases" }];
  SpreadsheetApp.getActiveSpreadsheet().addMenu("Get Enail Aliases", subMenu);
}

function listUsersWithEmailAliases() {

  //Sheets Prep
  let userCol = 1, primaryCol = 2, aliasCol = 3;
  let pageToken, page;
  let activeRow = 2;
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.clear();
  sheet.getRange(1, userCol).setValue("Name");
  sheet.getRange(1, primaryCol).setValue("Primary Email");
  sheet.getRange(1, aliasCol).setValue("Email Alias");

  //Format column headers
  sheet.getRange("A1:C1").setHorizontalAlignment("CENTER");
  sheet.getRange("A1:C1").setBackground("#000000");
  sheet.getRange("A1:C1").setFontColor("#FFFFFF")
  sheet.getRange("A1:C1").setFontWeight("BOLD");
  
  //User list extraction
  do {
    page = AdminDirectory.Users.list({
      customer: 'my_customer',
      maxResults: 500, //This value can be from 0 to 500 max
      pageToken,
      fields: 'users(name/fullName,primaryEmail,aliases),nextPageToken',
    })
    let users = page.users
    if (users) {
      for (let i = 0; i < users.length; i++) {
        const user = users[i]
        if (user.aliases && user.aliases.length > 0) {
          //Inserting data into Google Sheets
          sheet.getRange(activeRow, userCol).setValue(user.name.fullName);
          sheet.getRange(activeRow, primaryCol).setValue(user.primaryEmail);
          sheet.getRange(activeRow, aliasCol).setValue(JSON.stringify(user.aliases));
          activeRow++
        }
      }
    } else {
      sheet.getRange(activeRow, userCol).setValue('Users not found.');
    }
    pageToken = page.nextPageToken
  } while (pageToken)
}
