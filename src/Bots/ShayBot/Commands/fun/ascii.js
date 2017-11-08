const Commands = require(`../../../../__Global/Structures/Commands`);
const asciify = require(`asciify`);
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
			group: basename(__dirname, `.js`),
			description: `Converts the text to an ascii`,
			usage: `[Text]`,
			aliases: []
		});
	}

	run(client, message, args) {
		if (args.length < 1) throw new Error(this.usage);

		asciify(args.join(` `), `standard`, (error, response) => {
			if (error) throw new Error(error);
			client.send(message, response, { code: `` });
		});
		return true;
	}
}

module.exports = Command;
