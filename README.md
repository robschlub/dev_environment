# dev_environment

Basic dev environment for python/javascript apps.

To submit anything to master branch, all code must pass testing, lint checking and building.

During development, to check whether code is going to pass this criteria, development environments are provided where the lint checking, building and testing can be performed.

## Development environments:

Three Docker files to generate containers for:

* Javascript development and testing
* Python development and testing
* Production

To load and enter an environment use:

`run_container.sh js`
`run_container.sh python`
`run_container.sh Production`

### Javascript Development Environment

The following can be used in the Javascript environment

* Webpack for transpiling, bundling and minifying
  * Transpiling to remove Flow types
  * Transpiling to ES2015 using babel
  * Bundling JS files into single file
  * Minifiying using Uglify
  * Run `webpack` at container console at path `/app`
* Flow type checking
  * Run `flow` at container console at path `/app`
* ESLint linting
  * Run `eslint shared` at container console at path `/app`
  * No output means there are no errors
* Jest testing
  * Run `jest` at container console at path `/app`

### Python Development Environment

The following can be used in the Python development environment:

* pytest for unit testing
  * Run `pytest` at container console at path `/app`
* flake8 for lint checking
  * Run `flake8` at container console at path `/app`
  * No output means there are no errors

If running the flask app in this environment, it can be accessed on port 5002 on the host machine.

## Flask Development Environment

The flask development environment is used to run the python flask app. It is setup to have fewer packages installed, it loads straight into flask, and its ports are mapped.

If running the flask app in this environment, it can be accessed on port 5001 on the host machine.

## Production Environment

The production environment is used to run the python flask app. It is setup to have fewer packages installed, it loads straight into flask and its ports are mapped.

If running the flask app in this environment, it can be accessed on port 5000 on the host machine.

## Jenkins support

A Jenkins file is included to integrate into Jenkins. Jenkins uses the docker containers  to run the lint checks, unit tests and build.




