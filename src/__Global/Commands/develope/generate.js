const Commands = require(`../../Structures/Commands`);
const { basename } = require(`path`);

class Command extends Commands {
	constructor(client) {
		super(client, {
			enabled: true,
			show: false,
			cooldown: false,
			cooldownAmount: 1,
			cooldownTime: 3,
			limit: false,
			limitAmount: 3,
			limitTime: 86400,
			name: basename(__filename, `.js`),
			group: basename(__dirname, `.js`),
			description: `Generates an invite to the guild`,
			usage: `[GuildID]`,
			aliases: []
		});
	}

	run(client, message, args) {
		if (!client.ownerIDs.includes(message.author.id)) throw new Error(`Sorry, you do not have permission for this command`);
		if (args.length < 1) throw new Error(this.usage);

		client.defaultChannel(client.guilds.get(args[0])).createInvite({ maxAge: 1 })
			.then(invite => client.send(message, invite.url))
			.catch(error => client.send(message, error, { code: `` }));
		return true;
	}
}

module.exports = Command;
