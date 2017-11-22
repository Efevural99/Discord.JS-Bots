const Commands = require(`../../Structures/Commands`);
const { cpuLoad, memoryUsage } = require(`os-toolbox`);
const { type, release, uptime } = require(`os`);
const { execSync } = require(`child_process`);
const { version } = require(`discord.js`);
const { basename } = require(`path`);

class Command extends Commands {
	constructor(client) {
		super(client, {
			enabled: true,
			show: true,
			cooldown: true,
			cooldownAmount: 1,
			cooldownTime: 30,
			limit: false,
			limitAmount: 3,
			limitTime: 86400,
			name: basename(__filename, `.js`),
			group: basename(__dirname, `.js`),
			description: `Shows bot & OS info`,
			usage: ``,
			aliases: [`bot`, `stats`, `info`]
		});
	}

	run(client, message) {
		if (message.guild.id === `361532026354139156`) return client.send(message, `Check #statistics`);

		if (!client.user.bot) message.delete({ timeout: 500 });
		this.send(client, message);
		return true;
	}

	send(client, message) {
		client.send(message, `Loading...`).then(async sent => {
			const usedMemory = await memoryUsage();
			const maxMemory = process.env.LOCAL ? 8096 : 512;

			let memberCount = 0;
			client.guilds.forEach(guild => {
				memberCount += guild.memberCount;
			});

			sent.edit(
				`= STATISTICS =\n` +

				`\nVersions\n` +
				`• Discord.js       :: ${version}\n` +
				`• Node             :: ${process.version}\n` +
				`• NPM              :: ${String(execSync(`npm -v`)).replace(`\n`, ``)}\n` +

				`\nSystem\n` +
				`• Uptime           :: ${client.formatTime(uptime)}\n` +
				`• OS Type          :: ${String(type).replace(`_`, ` `)} v${release}\n` +
				`• System CPU Usage :: ${await cpuLoad()}%\n` +
				`• System RAM Usage :: ${usedMemory}% (${Math.round((usedMemory / 100) * maxMemory)} MB / ${process.env.LOCAL ? `8 GB` : `512 MB`})\n` +

				`\nBot\n` +
				`• Uptime           :: ${client.formatTime(process.uptime())}\n` +
				`• Heartbeat Ping   :: ${Math.round(client.ping)}ms\n` +
				`• Message Ping     :: ${Math.round(message.author === client.user ? message.editedTimestamp - sent.editedTimestamp : message.createdTimestamp - sent.createdTimestamp)}ms\n` +
				`• Bot RAM Usage    :: ${Math.round((process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100)} MB\n` +

				`\nBot Stats\n` +
				`• Guilds           :: ${client.formatNumbers(client.guilds.size)}\n` +
				`• Members          :: ${client.formatNumbers(memberCount)}\n` +
				`• Emojis           :: ${client.formatNumbers(client.emojis.size)}\n` +
				`• Categories       :: ${client.formatNumbers(client.channels.filter(channel => channel.type === `category`).size)}\n` +
				`• Text Channels    :: ${client.formatNumbers(client.channels.filter(channel => channel.type === `text`).size)}\n` +
				`• Voice Channels   :: ${client.formatNumbers(client.channels.filter(channel => channel.type === `voice`).size)}\n`,
				{ code: `asciidoc` });
		});
	}
}

module.exports = Command;
