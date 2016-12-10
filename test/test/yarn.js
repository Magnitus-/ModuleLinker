const moduleLinker = require('../lib/index');
const path = require('path');
const fs = require('fs');

exports.test = {
    'basic_functionality': function(test) {
        test.expect(2);
        moduleLinker([path.join(__dirname, '../app'), path.join(__dirname, '../shared')], [path.join(__dirname, '../shared')], 'yarn').then(() => {
            test.ok(fs.readlinkSync('/root/.config/yarn/link/user-store').match(/\/opt\/shared\/user-store/) &&
                    fs.readlinkSync('/root/.config/yarn/link/capitalize-array').match(/\/opt\/shared\/array\/capitalize-array/) &&
                    fs.readlinkSync('/root/.config/yarn/link/sort-array').match(/\/opt\/shared\/array\/sort-array/), "Ensure the linker worked");
            test.ok(fs.readlinkSync(path.join(__dirname, '../app/node_modules/user-store')).match(/\/root\/[.]config\/yarn\/link\/user-store/) &&
                    fs.readlinkSync(path.join(__dirname, '../shared/user-store/node_modules/capitalize-array')).match(/\/root\/[.]config\/yarn\/link\/capitalize-array/) &&
                    fs.readlinkSync(path.join(__dirname, '../shared/user-store/node_modules/sort-array')).match(/\/root\/[.]config\/yarn\/link\/sort-array/), "Ensure the resolver worked");
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            test.done();
        });
    }
}