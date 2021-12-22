# Slack application for managing technical code challenges using Github as SCM

Ported from https://github.com/keremk/challenge-bot (golang) to typescript running on NodeJS

# Development setup

For local development you have a `Makefile` available for you exposing the basic commands needed. You can also go straight into npm scripts for a more fine granular experience.
## Dependencies

You need to have `docker` and `docker-compose` installed on your development machine to get the dev environment working.

## Preparation

To prepare the environment setup you must run:

```
make setup
```

This command will:
- build the docker-dev image
- install dependencies (including dev)
- setup git hooks
- setup the database
- run all tests and linters to make sure everything is going OK
- start the db inside a container so it can be used while developing

## Developing a new feature

For developing a new feature you must create a branch or a fork and propose a pull-request. No Specific rules are for now being applied to PR etiquette.

## Tests in watch mode

It is highly recommended that, while you're developing, you have your tests running in `watch mode``

```
make test-watch
```

## Changing DB schema

When you need to change the schema. You just need to change/add the entity in ./src/Infrastucture/db/entity and run

```
make db-migration-generate migrationName=<my_migration_name>
```

When you need to run the migration run: 

```
make db-migrate
```

