module.exports = {
  name: "ping",
  description: "ping",
  userPerms: [],
  botPerms: [],
  run: async (client, message, args) => {
    return message.reply({ content: `${client.ws.ping} ms!` });
  },
};
