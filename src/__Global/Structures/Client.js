const Database = require(`./Database`);
const { Client, MessageEmbed, Collection } = require(`discord.js`);
const { readdirSync, statSync } = require(`fs`);
const { sep, resolve } = require(`path`);
const { inspect } = require(`util`);
const moment = require(`moment`);

class CustomClient extends Client {
	constructor(options) {
		super(options);
		this.botName = resolve(`.`).split(sep).slice(-1).toString();
		this.botPrefix = `${this.botName.toLowerCase().charAt(0)}!`;
		this.aliases = new Collection();
		this.commands = new Collection();
		this.database = new Database;
		this.cooldown = [];
		this.blacklist = [];
		this.whitelist = [];
		this.ownerIDs = [`358558305997684739`];
	}

	//
	// Console (log|warn|error)
	//
	console(input, type) {
		const embed = new MessageEmbed()
			.setDescription(input)
			.setColor(0x00FF00)
			.setFooter(`${type} | ${this.botName}`)
			.setTimestamp();
		this.channels.get(`361533828520476684`).send({ embed });
	}

	log(input) {
		console.log(input);
		if (process.env.LOCAL) return;
		this.console(input, `Log`);
	}

	warn(input) {
		console.warn(input);
		if (process.env.LOCAL) return;
		this.console(input, `Warn`);
	}

	error(input) {
		console.error(input);
		if (process.env.LOCAL) return;
		this.console(input, `Error`);
	}
	// End Console

	// Cooldown (add|remove|check)
	addCooldown(userID, commandName, time, date) {
		this.cooldown.push({ ID: userID, COMMAND: commandName, TIME: time, DATE: date });
		this.removeCooldown(userID, commandName, time);
	}

	removeCooldown(userID, commandName, time) {
		let index = null;
		for (let i = 0; i < this.cooldown.length; i++) {
			if (this.cooldown[i].ID === userID && this.cooldown[i].COMMAND === commandName) {
				index = i;
				break;
			}
		}

		setTimeout(() => {
			this.cooldown = this.cooldown.splice(index, 0);
		}, time * 1000);
	}

	checkCooldown(userID, commandName) {
		let found = false;
		for (let i = 0; i < this.cooldown.length; i++) {
			if (this.cooldown[i].ID === userID && this.cooldown[i].COMMAND === commandName) {
				found = true;
				break;
			}
		}
		return found;
	}

	checkCooldownTime(userID, commandName) {
		let date = new Date;
		let time = null;
		for (let i = 0; i < this.cooldown.length; i++) {
			if (this.cooldown[i].ID === userID && this.cooldown[i].COMMAND === commandName) {
				date = this.cooldown[i].DATE;
				time = this.cooldown[i].TIME;
				break;
			}
		}
		return (moment(date).add(time, `seconds`) - new Date).toString().charAt(0);
	}
	// End Cooldown

	//
	// Misc (send|missingArgs|clean|formatTime|formatNumbers|defaultChannel)
	//
	send(message, ...content) {
		return new Promise(async resolve => {
			if (this.user.bot) {
				resolve(await message.channel.send(...content));
			} else {
				setTimeout(async () => {
					resolve(await message.edit(...content));
				}, 500);
			}
		});
	}

	missingArgs(message, usage) {
		const embed = new MessageEmbed()
			.setTitle(`Command Usage`)
			.setDescription(`\`\`\`\n${usage}\n\`\`\``)
			.setColor(0xFF7900)
			.setFooter(this.botName)
			.setTimestamp();
		this.send(message, { embed });
	}

	clean(text) {
		let SECRET = `[SECRET!]`;
		if (typeof text !== `string`) { text = inspect(text, { depth: 0 }); }
		text = text
			.replace(/`/g, `\`${String.fromCharCode(8203)}`)
			.replace(/@/g, `@${String.fromCharCode(8203)}`);

		// API Keys
		for (let env in process.env) {
			if (env.includes(`_API`)) {
				text = text.replace(process.env[env], SECRET);
			}
		}

		// Webhooks
		for (let env in process.env) {
			if (env.includes(`WEBHOOK_`)) {
				text = text.replace(process.env[env], SECRET);
			}
		}

		// Tokens
		isDirectory(resolve(`../../Bots`)).forEach(dir => {
			text = text.replace(process.env[dir], SECRET);
		});

		function isDirectory(source) {
			return readdirSync(source).filter(name => statSync(`${source}/${name}`).isDirectory());
		}

		return text;
	}

	formatTime(input, toggle) {
		let days = Math.floor(input / 86400);
		let hours = Math.floor((input % 86400) / 3600);
		let minutes = Math.floor(((input % 86400) % 3600) / 60);
		let seconds = Math.floor(((input % 86400) % 3600) % 60);

		let output = [];

		let dayStr = `d`;
		let hourStr = `h`;
		let minuteStr = `m`;
		let secondStr = `s`;

		if (toggle) {
			dayStr = ` days`;
			hourStr = ` hours`;
			minuteStr = ` minutes`;
			secondStr = ` seconds`;
		}

		if (days > 0) output.push(`${days}${dayStr}`);
		if (hours > 0) output.push(`${hours}${hourStr}`);
		if (minutes > 0) output.push(`${minutes}${minuteStr}`);
		if (seconds > 0) output.push(`${seconds}${secondStr}`);

		return output.join(` `);
	}

	formatNumbers(input) {
		return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, `,`);
	}

	defaultChannel(guild) {
		guild.channels
			.filter(c => c.type === `text` &&
					c.permissionsFor(guild.me).has(`SEND_MESSAGES`))
			.sort()
			.first();
	}
	// End Misc
}

module.exports = CustomClient;
