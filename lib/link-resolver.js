const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const actOnModules = require('act-on-modules');
Promise = require('bluebird');

var childProcessExec = Promise.promisify(childProcess.exec, {'multiArgs': true});
var fsReadFile = Promise.promisify(fs.readFile);

var dependencyLinkPromises = [];

function resolveDependencies(directory)
{
    //console.log('Resolving dependencies in directory: ' + directory);
    dependencyLinkPromises.push(fsReadFile(path.join(directory, 'package.json'), 'utf8').then((package) => {
        var package = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
        if(package.localDependencies)
        {
            var promises = [];
            package.localDependencies.forEach(function(localDependency) {
                promises.push(childProcessExec("npm link "+localDependency, {'cwd': directory}));
            });
            return Promise.all(promises);
        }
    }));
}

function link(dependents)
{
    dependencyLinkPromises = [];
    return new Promise((resolve, reject) => {
        Promise.all(dependents.map((directory) => {
            return actOnModules(directory, resolveDependencies);
        })).then(() => {
            return Promise.all(dependencyLinkPromises);
        }).then((results) => {
            //console.log('resolver logs');
            results.forEach((results) => {
                if(results)
                {
                    results.forEach((result) => {
                        console.log(result[0]);
                        console.log(result[1]);
                    });
                }
            });
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = link;