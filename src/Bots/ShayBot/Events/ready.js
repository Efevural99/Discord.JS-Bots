const Events = require(`../../../__Global/Structures/Events`);

class Event extends Events {
	async run(client) {
		await client.database.find({ TOKENS: { $type: 2 } }).then(data => {
			data[0].TOKENS.forEach(async token => {
				if (token.toString() === `0`) return client.tokens.push(token);
				if (!process.env.LOCAL) {
					await client.cmds.commands.get(`token`).check(token, `ShayBot Automatic Check`).then(name => {
						client.tokens.push(token);
						console.log(name);
					}).catch(() => null);
				}
				return true;
			});
			client.database.update({ TOKENS: { $type: 2 } }, { TOKENS: client.tokens });
			return true;
		});

		if (process.env.LOCAL) return false;

		const guild = client.guilds.get(client.servers.MAIN);
		guild.pruneMembers({ days: 1, dry: true }).then(number => number > 0 ? guild.pruneMembers({ days: 1 }) : false);
		return true;
	}
}

module.exports = Event;
