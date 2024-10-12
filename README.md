<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Fallout TTRPG Pip-Boy](#fallout-ttrpg-pip-boy)
  - [Technologies used](#technologies-used)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Project Components](#project-components)
  - [Contributing](#contributing)
  - [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Fallout TTRPG Pip-Boy

Welcome to the Fallout TTRPG Pip-Boy project. This project is a full-stack
application used to host pip-boy style character sheets for the [Arcane Arcade
Fallout TTRPG](https://www.patreon.com/posts/fallout-ttrpg-103357402). This
includes a front-end made using React, a backend written in python, a sqlite
database (present in the backend folder), and an NGINX proxy service for
handling requests.

The app includes a DM view and a Player view, with interactable hp and limb
statuses. This project requires you to host the server on your machine and then
your players/dm can access the frontend via web-browser.

## Technologies used

- [NGINX](https://nginx.org/en/)
- [Python Flask](https://flask.palletsprojects.com/en/3.0.x/)
- [REACT](https://react.dev/)

## Installation

To install this project you will need to clone the repository to your local
machine. This project is run using docker so you will also need to download
[Docker](https://www.docker.com/).

## Usage

This project is run on a machine (it can be your personal machine or a server) that is capable of spinning up Docker containers.

To run the project you can use docker-compose to build and spin up all of the
containers that this project uses.

Start up a terminal and navigate to the directory containing the project:

`cd Repos/this-project`

`this-project` is the directory that this project has been cloned in.

Next make sure that the docker engine is running. You can either start the application or run the docker daemon by following the instructions on the [Docker Site](https://docs.docker.com/engine/daemon/start/)

The following command will build and run all of the containers

`docker-compose -f docker-compose.yaml up -d --build`

Once you have this running players can connect to it by typing in the IP
address of the host. If on the same network it should be the local IP address.

_note: We are yet to test it with an offsite server so we will update this section when that is accomplished._

To take down the containers, which you probably want to do if running on your personal machine, you can execute the following command.

`docker-compose -f docker-compose.yaml down`

If you want to take the service down without any of the data persisting, for example you were simply testing out the project, you can instead run the following command.

`docker-compose -f docker-compose.yaml -v --remove-orphans`

## Project Components

- [Frontend](frontend/README.md) Frontend directory containing the REACT
  webapp source code that acts as the interface for the User
- [Backend](backend/README.md) Backend directory containing the source code for
  the python flask app that runs the server.
- [Proxy](proxy/README.md) Proxy directory containing the configuration for the
  [NGINX](https://nginx.org/en/) reverse proxy used for handling requests

## Contributing

To contribute please follow the following guide:

1. If you have a feature, bug-fix, or documentation contribution you would like to make open an issue in the project. Please make sure that this is not a duplicate issue by searching through the already present issues.
2. Once you have either created an issue and it has been approved, or you have
   found an issue you would like to work on, you should request to be assigned the issue.
3. Once assigned create a branch with the following structure:
   `feature-name/user-name`
   i.e.
   If I were to work on a feature to add creature generation my branch would be
   as follows:
   `creature-generation/zavastopher`
4. Once you have finished your implementation create a pull request to be
   reviewed and approved.
5. Once approved your PR will be merged.

notes:

Features and Issues may be rejected if after review they do not fit the project
but we will try our best to be fair and transparent as to why such a decision
was made.

## License

This project is licensed under the [MIT License](docs/license.txt)
