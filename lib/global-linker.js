const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const actOnModules = require('act-on-modules');
Promise = require('bluebird');

var childProcessExec = Promise.promisify(childProcess.exec, {'multiArgs': true});
var fsReadFile = Promise.promisify(fs.readFile);

var globalLinkPromises = [];

function linkGlobally(directory)
{
    //console.log('Creating global link for directory: ' + directory);
    globalLinkPromises.push(childProcessExec("npm link", {'cwd': directory}));
}

function link(dependencies)
{
    globalLinkPromises = [];
    return new Promise((resolve, reject) => {
        Promise.all(dependencies.map((directory) => {
            return actOnModules(directory, linkGlobally);
        })).then(() => {
            return Promise.all(globalLinkPromises);
        }).then((results) => {
            //console.log('linker logs');
            results.forEach((result) => {
                console.log(result[0]);
                console.log(result[1]);
            });
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports = link;