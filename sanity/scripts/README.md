We will invite a new user to the project with no predefined access, and then add this user to the `editors` system group, where it will be able to create posts of type `event`.

## Setting up

- Make sure you have access control enabled on your project's plan or this example will not work.
- Make a new token that has "Create Session" capabilities at manage.sanity.io under your project's "Settings > API > Tokens"
- Invite a user with role "Custom (none)" from the "Team" page at manage.sanity.io for the project.
- Start the studio `sanity start`. Try logging into the Studio with the newly invited user. The user will not be able to create anything.
- Edit [`./scripts/addAccessControl.js`](scripts/addAccessControl.js) to match your test user's project member id.
- You can find the project member id at https://api.sanity.io/v1/projects/bs9rmafh under `.members.id`.
- Run `SANITY_TOKEN=xxx npm run add-access-control` to setup the access rule for `editors`
  (replace xxx with your token from the second step, for change dataset set SANITY_DATASET=xxx).
- Logged in as the journalist, you are now able to create a new `event`.

## Documentation

- https://www.sanity.io/docs/access-control
