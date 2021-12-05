module.exports =
{
    slashcommand_Global(pCommandName, pCommandDescription, pOptions, pChannelWhitelist) {
        if (pOptions !== undefined) {
            return {
                name: pCommandName,
                description: pCommandDescription,
                channel_whitelist: pChannelWhitelist,
                options: pOptions
            };
        }
        else {
            return {
                name: pCommandName,
                description: pCommandDescription,
                channel_whitelist: pChannelWhitelist
            };
        }
    },

    command_registry_prototype(pCommandName, pCommandDescription, pCommandHelpText, pCommandParameters = null, pCommandAlternatives = null) {
        return {
            name: pCommandName,
            description: pCommandDescription,
            helpText: pCommandHelpText,
            parameters: [
                pCommandParameters
            ],
            alternatives: [
                pCommandAlternatives
            ]
        };
    }
};