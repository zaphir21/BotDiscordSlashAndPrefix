const { REST, Routes } = require('discord.js');
const { clientId, guildId, token, fichierCommand } = require('./config.json');
const fs = require('node:fs');

const commands = [];
commandDossiers = fs.readdirSync('./commands');
for (const dossier of commandDossiers){
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync(`./commands/${dossier}/`).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${dossier}/${file}`);
	const prefixedCommandName = `${command.data.name}`;
    command.data.name = prefixedCommandName;
	commands.push(command.data);
}
}


// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();