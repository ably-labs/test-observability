# Test observability server

This is a web application which provides:

- an API for uploading JUnit-format unit test results
- a website for viewing aggregate information about all the uploaded test results

You might want to use it to observe trends in your test results — for example, finding out which tests fail most frequently. We’ve been using it for this purpose in https://github.com/ably/ably-cocoa/issues/1279.

## Take a look at an example

The Ably SDK team is currently using it for observing the results of the [ably-cocoa SDK](https://github.com/ably/ably-cocoa)’s tests. You can take a look at our instance at https://test-observability.herokuapp.com/.

## How it’s built

It’s written in [TypeScript](https://www.typescriptlang.org/), and uses the [Nest](https://nestjs.com/) web application framework and [TypeORM](https://github.com/typeorm/typeorm) ORM. It uses a PostgreSQL database for storage.

## How to run it locally

### Dependencies

The instructions here are for macOS only, but should be similar on other platforms.

- [Node.js](https://nodejs.org/en/) version 16.14.0
  - install using, for example, [nvm](https://github.com/nvm-sh/nvm) or `brew install node@16`
- [PostgreSQL server](https://www.postgresql.org/)
  - install using `brew install postgresql`

### Setup instructions

1. If you don’t already have a local PostgreSQL user, create one:

   ```bash
   $ sudo -u postgres createuser $USER --createdb
   ```

2. Create the database:

   ```bash
   $ createdb test_observation
   ```

3. Install dependencies:

   ```bash
   $ npm install
   ```

4. Run the server in development mode (will restart each time you change the code):

   ```bash
   $ npm run start:dev
   ```

5. You can now access the server at http://localhost:3000.

## How to deploy it

It’s ready to be deployed to [Heroku](https://www.heroku.com). You just need to set a [config var](https://devcenter.heroku.com/articles/config-vars) containing a randomly-generated `TEST_OBSERVABILITY_AUTH_KEY` value.

## How to upload results to it

A couple of examples:

- [test-observability-action](https://github.com/ably/test-observability-action/) is a GitHub action for uploading a JUnit report to an instance of this server
- the [`local_dev_upload_test_results.sh`](https://github.com/ably/ably-cocoa/blob/main/Scripts/local_dev_upload_test_results.sh) and [`upload_test_results.sh`](https://github.com/ably/ably-cocoa/blob/main/Scripts/upload_test_results.sh) scripts in [ably-cocoa](https://github.com/ably/ably-cocoa)

## Development tips

### How to generate a migration

If you want to modify the database schema (e.g. add columns, change a column from nullable to non-nullable, …), you’ll need to do so using a [TypeORM migration](https://orkhan.gitbook.io/typeorm/docs/migrations). TypeORM is able to generate these migrations automatically from your entity files. Do the following:

1. Update your entity `.ts` files to reflect the new characteristics of the schema.
2. Generate the migration:
   ```bash
   $ npm exec typeorm migration:generate -- -n '<insert a good name for the migration here, e.g. MakeGithubBaseAndHeadRefsNullable>'
   ```

Migrations are automatically run when the server starts up.
