const Commands = require(`../Structures/Commands`);
const { MessageEmbed } = require(`discord.js`);
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
			description: `Gives bot invite link`,
			usage: `Invite`,
			aliases: []
		});
	}

	run(client, message) {
		let embed = new MessageEmbed();

		if (client.user.bot) {
			embed
				.setTitle(`Invite Link`)
				.setURL(`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`)
				.setColor(0x00FFFF)
				.setFooter(`Note: I may be a private bot`);
		} else {
			embed
				.setTitle(`I'm a user account, I can't be invited`)
				.setColor(0x00FFFF);
		}
		client.send(message, { embed });
	}
}

module.exports = Command;
