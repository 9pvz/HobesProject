const { EmbedBuilder } = require("@discordjs/builders");
const client = require("../index");
const { PermissionsBitField, Colors } = require("discord.js");

client.on("messageCreate", async (message) => {
  if (
    message.author.bot ||
    !message.guild ||
    !message.content.toLowerCase().startsWith(client.config.prefix)
  )
    return;
  const [cmd, ...args] = message.content
    .slice(client.config.prefix.length)
    .trim()
    .split(/ +/g);

  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

  if (!command) return;
  if (command.userPerms || command.botPerms) {
    if (
      !message.member.permissions.has(
        PermissionsBitField.resolve(command.userPerms || [])
      )
    ) {
      const userPerms = new EmbedBuilder()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL({ dyanmic: true }),
        })
        .setDescription(
          `**:x: ${message.author.username}, في صلاحيات ما عندك ياها**`
        )
        .setColor(Colors.DarkRed)
        .addFields([
          {
            name: "الصلاحيات:",
            value: `\`\`\`${command.userPerms}\`\`\``,
            inline: true,
          },
        ])
        .setFooter({
          text: message.guild.name,
          iconURL: message.guild.iconURL(),
        });
      return message.reply({
        embeds: [userPerms],
        ephemeral: true,
      });
    }
    if (
      !message.guild.members.cache
        .get(client.user.id)
        .permissions.has(PermissionsBitField.resolve(command.botPerms || []))
    ) {
      const botPerms = new EmbedBuilder()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL({ dyanmic: true }),
        })
        .setDescription(
          `**:x: ${message.author.username}, في صلاحيات ما عندي ياها**`
        )
        .setColor(Colors.DarkRed)
        .addFields([
          {
            name: "الصلاحيات:",
            value: `\`\`\`${command.botPerms}\`\`\``,
            inline: true,
          },
        ])
        .setFooter({
          text: message.guild.name,
          iconURL: message.guild.iconURL(),
        });
      return message.reply({
        embeds: [botPerms],
        ephemeral: true,
      });
    }
  }
  /*if (command.onlyCustomRole === true) {
    if (!message.member.roles.cache.has(client.config.adminRole)) return;
  }*/
  if (command.noPausedUse === true) {
    if (message.member.roles.cache.has(client.config.rolePaused))
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
            .setColor(Colors.Red)
            .setDescription(`### إشعار خطأ:\n* الشخص تم إيقاف خدماته!`),
        ],
      });
  }
  await command.run(client, message, args).catch(async (err) => {
    console.log(err);
  });
});
