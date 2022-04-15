/**
 * list users that have email aliases
 * Usage:
 * 1. copy and paste this source code to your Apps Script Editor
 * 2. select the following function name
 * 3. click 'Run'.
 * 4. The users with email aliases will be printed in the 'Execution log'
 *
 * © 2021 xFanatical, Inc.
 * @license MIT
 * @version 1.0.2 fix a pagination issue
 * @version 1.0.1 print out aliases
 * @version 1.0.0 proof of concept
 */
function listUsersWithEmailAliases() {
  let pageToken
  let page
  do {
    page = AdminDirectory.Users.list({
      customer: 'my_customer',
      maxResults: 100,
      pageToken,
      fields: 'users(name/fullName,primaryEmail,aliases),nextPageToken',
    })
    let users = page.users
    if (users) {
      for (let i = 0; i < users.length; i++) {
        const user = users[i]
        if (user.aliases && user.aliases.length > 0) {
          Logger.log(user `${user.name.fullName} ${user.primaryEmail} 
            + has ${user.aliases.length} email alias ${user.aliases.length > 1 ? 'is' : ''}: `
            + JSON.stringify(user.aliases))
        }
      }
    } else {
      Logger.log('No users found.')
    }
    pageToken = page.nextPageToken
  } while (pageToken)
}
