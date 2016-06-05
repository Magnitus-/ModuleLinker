const resolver = require('./link-resolver');
const linker = require('./global-linker');

function link(dependents, dependencies)
{
    return linker(dependencies).then(() => {
        return resolver(dependents);
    });
}

link.linker = linker;
link.resolver = resolver;

module.exports = link;