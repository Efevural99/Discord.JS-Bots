const Commands = require(`../Structures/Commands`);
const { basename } = require(`path`);

class Command extends Commands {
	constructor(client) {
		super(client, {
			enabled: true,
			show: true,
			cooldown: false,
			cooldownAmount: 1,
			cooldownTime: 3,
			limit: false,
			limitAmount: 3,
			limitTime: 86400,
			name: basename(__filename, `.js`),
			description: `Displays all the commands`,
			usage: `Help (Command)`,
			aliases: [`?`]
		});
	}

	run(client, message, args) {
		if (args.length < 1) {
			const commandNames = Array.from(client.commands.keys());
			const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);
			const content =
				`= Command List =\n` +
				`\n` +
				`[Use ${client.botPrefix}help <commandname> for details]\n` +
				`\n` +
				`${client.commands.sort().map(c => c.show ? `${client.botPrefix}${c.name}${` `.repeat(longest - c.name.length)} :: ${c.description}\n` : null).join(``)}`;
			client.send(message, content, { code: `asciidoc` });
		} else {
			let command = args[0];
			if (client.commands.has(command)) {
				command = client.commands.get(command);
				const content =
					`= ${command.name} = \n` +
					`${command.description}\n` +
					`usage::${command.usage}`;
				client.send(message, content, { code: `asciidoc` });
			}
		}
		return true;
	}
}

module.exports = Command;
