const resolver = require('./link-resolver');
const linker = require('./global-linker');

function link(dependents, dependencies, tool)
{
    return linker(dependencies, tool).then(() => {
        return resolver(dependents, tool);
    });
}

link.linker = linker;
link.resolver = resolver;

module.exports = link;