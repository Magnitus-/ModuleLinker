#Purpose

The module linker is a tool to recursively link and resolve local dependencies such that local modules can be required by name instead of their relative path.

#Behavior

It uses 'npm link' the linking and 'act-on-modules' project to find modules (recursively traversing directories and stopping whenever it finds a package.json file).

#Usage

##linker

###Description

This method will recursively traverse a series of directories it is given and globally link (to make available to the resolver) any module it finds.

###Signature

```
const moduleLinker = require('module-linker');
moduleLinker.linker([<Strings of paths containing modules that will be required>]) //Returns a promise
```

###Example

```
const moduleLinker = require('module-linker');
moduleLinker.linker(['/home/eric/nodeJsModules']).then(() => {
    console.log('all done');
});
```

##resolver

###Description

This method will recursively traverse a series of directories it is given and resolve any local dependencies it finds. Dependencies need to be indicated in the localDependencies entry of package.json files.

###Signature

```
const moduleLinker = require('module-linker');
moduleLinker.resolver([<Strings of paths containing code that has local dependencies that need to be resolved>]) //Returns a promise
```

###Example

```
const moduleLinker = require('module-linker');
moduleLinker.resolver(['/home/eric/app', '/home/eric/nodeJsModules']).then(() => {
    console.log('all done');
});
```

##call

###Description

A direct call to the library will call both the linker and resolver (sequentially as the resolver is dependent on the linker being finished).

###Signature

```
const moduleLinker = require('module-linker');
moduleLinker([<Strings of paths containing code that has local dependencies that need to be resolved>], [<Strings of paths containing modules that will be required>]) //Returns a promise
```

###Example

```
const moduleLinker = require('module-linker');
moduleLinker(['/home/eric/app', '/home/eric/nodeJsModules'], ['/home/eric/nodeJsModules']).then(() => {
    console.log('all done');
});
```

##Package.json pre-requisites

There are two pre-requisites in package.json files for the library to work as intended.

- All modules that are to be required, need to have a legal unique (within the project) module name. This is the 'name' entry in the package.json file
- All modules that have local dependencies, need to have a "localDependencies" in their package.json file listing their local dependencies as an array of strings. This is a custom entry that is used solely by the library.

Ex:

```
{
  "name": "sample-app",
  "version": "1.0.0",
  "main": "index.js",
  "licenses": [
    {
      "type": "MIT License",
      "url": "http://mit-license.org/"
    }
  ],
  "dependencies": {
  },
  "devDependencies": {
  },
  "localDependencies": ["user-store"],
  "license": "MIT",
  "directories": {
  },
  "scripts": {
      "start": "node index.js"
  }
}
```

##Running Tests

Run ```npm test```

Because I didn't want the tests to pollute anyone's global space with throwaway test modules, I dockerized them so you'll need docker and docker-composed installed (as well as a user with enough privilege to execute docker without sudo) to run the tests.

##Installation

Run ```npm install module-linker```
