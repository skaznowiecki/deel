# DEEL BACKEND TASK

This backend exercise involves building a Node.js/Express.js app that will serve a REST API. We imagine you should spend around 3 hours at implement this feature.

## Technical considerations

- Implemented a three layer architecture (controller, service, repository).
- I have to update sqlite3 to the last version because the provided version had compatibility issues.

## API documentation

Swagger documentation is available at `http://localhost/api-docs`

## Technical improvements

Due to the limited time that the project had (between 3 and 4 hours) there are some technical aspects that I left out, but they are worth mentioning as improvements:

- Use `typescript`. I used the template provided, however it'll be better to use `typescript` to have a better type checking and to avoid some bugs.
- Implement unity tests. I only implemented integration tests, but it'll be better to have unity tests as well.
- Implement design patterns like dependency injection to avoid use the repository directly in the service layer.
- Implement a logger to log the errors and the requests.
- Implement a search engine like `elasticseach` to improve query on endpoints like `GET /admins/*`.

## Getting Set Up

1. Clone this repo
2. Run `npm install`
3. Copy .env.example to .env and fill in the values
4. Run `npm run start` to start the server in development mode

## Testing

1. Run `npm install` to run the tests.
2. Run `npm run test` to run the tests.

### Considerations of testing

- I used `jest` to run the tests.
- I used `supertest` to test the API endpoints.
- I used `sqlite3` in `memory` as the database for testing.
