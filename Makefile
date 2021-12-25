#!make
.SILENT :

##
##
##
##            
##            ██████╗ ███████╗██╗   ██╗     ██████╗ ██████╗ ███╗   ██╗███████╗ ██████╗ ██╗     ███████╗
##            ██╔══██╗██╔════╝██║   ██║    ██╔════╝██╔═══██╗████╗  ██║██╔════╝██╔═══██╗██║     ██╔════╝
##            ██║  ██║█████╗  ██║   ██║    ██║     ██║   ██║██╔██╗ ██║███████╗██║   ██║██║     █████╗  
##            ██║  ██║██╔══╝  ╚██╗ ██╔╝    ██║     ██║   ██║██║╚██╗██║╚════██║██║   ██║██║     ██╔══╝  
##            ██████╔╝███████╗ ╚████╔╝     ╚██████╗╚██████╔╝██║ ╚████║███████║╚██████╔╝███████╗███████╗
##            ╚═════╝ ╚══════╝  ╚═══╝       ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝ ╚═════╝ ╚══════╝╚══════╝
##                                                                                       
##
##
##
##
## Welcome to the Developer console!
##
##      usage: make <command>
##
##
##
## Available commands:
##
service?='app'
file?=''
migrationName?=''

# Include common Make tasks
root_dir:=$(shell pwd)

help: ## This help dialog.
	    @IFS=$$'\n' ; \
    help_lines=(`fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//'`); \
    for help_line in $${help_lines[@]}; do \
        IFS=$$'#' ; \
        help_split=($$help_line) ; \
        help_command=`echo $${help_split[0]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
        help_info=`echo $${help_split[2]}` ; \
        printf "%-30s %s\n" $$help_command $$help_info ; \
    done
.PHONY: help


setup: ## Installs all dependencies (docker for mac should be preinstalled)
	docker-compose build
	make start
	docker-compose run --rm app npm install
	docker-compose run --rm app npm run prepare
	docker-compose run --rm app npm run precommit
	make db-migrate
	make stop
	echo "Application setup finished. run make start to start the server"
.PHONY: setup

start: ## Starts the application
	docker-compose up
.PHONY: start

restart: ## Restarts the application
restart: stop start
.PHONY: restart

stop: ## Stops the application
	docker-compose stop
.PHONY: stop

status: ## Status for the services (alias to docker-compose ps)
	docker-compose ps
.PHONY: status

test: ## Run tests for the file passed as parameter or the entire suite if none passed. Syntax: make test file=<path/to/test/file.rb>
	docker-compose run --rm app npm test $$file
.PHONY: test

test-watch: ## Run tests for the file passed as parameter or the entire suite if none passed. Syntax: make test file=<path/to/test/file.rb>
	docker-compose run --rm app npm test:watch
.PHONY: test-watch

db-migrate: # Run all pending db migrations
	docker-compose run --rm app npm run typeorm migration:run
.PHONY: db-migrate

db-migration-generate: # Create a migration considering changes in the code. Pass variable migrationName
	docker-compose run --rm app npm run typeorm migration:generate -- -n $$migrationName
	mv ./*$$migrationName* ./src/Infrastructure/db/migrations/
.PHONY: db-migration-generate

logs: ## View logs
	docker-compose logs -f ${service}
.PHONY: logs
