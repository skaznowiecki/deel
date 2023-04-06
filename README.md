# DEEL BACKEND TASK

This backend exercise involves building a Node.js/Express.js app that will serve a REST API. We imagine you should spend around 3 hours at implement this feature.

## Technical considerations

- Implemented a three layer architecture (controller, service, repository).
- I have to update sqlite3 to the last version because the provided version had compatibility issues.

## Technical improvements

Due to the limited time that the project had (between 3 and 4 hours) there are some technical aspects that I left out, but they are worth mentioning as improvements:

- Use `typescript`. I used the template provided, however it'll be better to use `typescript` to have a better type checking and to avoid some bugs.
- Implement documentation. Setup the documentation with `swagger` or any other tool.
- Implement unity tests. I only implemented integration tests, but it'll be better to have unity tests as well.

## Getting Set Up

1. Clone this repo
2. Run `npm install`
3. Copy .env.example to .env and fill in the values
4. Run `npm run start` to start the server in development mode

## Testing

1. Run `npm install` to run the tests.
2. Run `npm run test` to run the tests.

### Considerations of testing

- We are using `jest` to run the tests.
- We are using `supertest` to test the API endpoints.
- We are using `sqlite3` in `memory` as the database for testing.
