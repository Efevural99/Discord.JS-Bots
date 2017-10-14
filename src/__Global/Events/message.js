const Events = require(`../Structures/Events`);

class Event extends Events {
	run(client, message) {
		if (message.author.bot) return;
		if (!client.user.bot && !client.ownerIDs.includes(message.author.id)) return;
		if (message.content.toLowerCase().indexOf(client.botPrefix) !== 0) return;
		if (client.blacklist.includes(message.author.id)) return;

		const args = message.content.split(/\s+/g);
		const commandName = args.shift().slice(client.botPrefix.length).toLowerCase();
		const command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));

		if (!command) return;
		if (!command.enabled) return;
		if (!client.whitelist.indexOf(message.author.id) > -1 && client.checkCooldown(message.author.id, commandName)) return client.send(message, `Cooldown, Please wait ${command.cooldownTime} seconds from the last use.`);
		if (command.cooldown) client.addCooldown(message.author.id, commandName, command.cooldownTime);
		if (message.author === client.user) client.addCooldown(message.author.id, 1);

		command.run(client, message, args);
	}
}

module.exports = Event;
