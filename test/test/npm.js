const moduleLinker = require('../lib/index');
const path = require('path');
const fs = require('fs');

exports.test = {
    'basic_functionality': function(test) {
        test.expect(2);
        moduleLinker([path.join(__dirname, '../app'), path.join(__dirname, '../shared')], [path.join(__dirname, '../shared')]).then(() => {
            test.ok(fs.readlinkSync('/usr/local/lib/node_modules/user-store') == '/opt/shared/user-store' &&
                    fs.readlinkSync('/usr/local/lib/node_modules/capitalize-array') == '/opt/shared/array/capitalize-array' &&
                    fs.readlinkSync('/usr/local/lib/node_modules/sort-array') == '/opt/shared/array/sort-array', "Ensure the linker worked");
            test.ok(fs.readlinkSync(path.join(__dirname, '../app/node_modules/user-store')) == '/usr/local/lib/node_modules/user-store' &&
                    fs.readlinkSync(path.join(__dirname, '../shared/user-store/node_modules/capitalize-array')) == '/usr/local/lib/node_modules/capitalize-array' &&
                    fs.readlinkSync(path.join(__dirname, '../shared/user-store/node_modules/sort-array')) == '/usr/local/lib/node_modules/sort-array', "Ensure the resolver worked");
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            test.done();
        });
    }
}