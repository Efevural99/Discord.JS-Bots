const Events = require(`../../../__Global/Structures/Events`);

class Event extends Events {
	async run(client, guild) {
		if (guild.id === `110373943822540800`) return undefined;

		if (guild.memberCound < 200) await guild.members.fetch();

		if (guild.roles.size > 200) {
			return client.defaultChannel(guild).send(`This server has more than 200 roles, This bot will not work.`);
		}

		if (guild.memberCount - guild.members.filter(member => member.user.bot).size > 200) {
			return client.defaultChannel(guild).send(`This server has more than 200 non-bot members, You may experience issues with the max role size`);
		}
		return true;
	}
}

module.exports = Event;
