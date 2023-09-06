const {
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  Colors,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "فك_خدمات",
  description: "فك خدمات شخص معين",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: [],
  onlyCustomRole: true,
  run: async (client, message, args) => {
    let user = message.mentions.members.first()?.id || args[0];
    let us = await message.guild.members.cache.get(user);
    if (!message.member.roles.cache.has(client.config.roles.ايقاف_الخدمات)) return;
    if (!us)
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
            .setColor(Colors.DarkRed)
            .setDescription(
              `### إشعار خطأ:\n* تأكد من إضافة الشخص المراد سحب الرتبة منه`
            ),
        ],
      });

    await us.roles
      .remove(client.config.rolePaused)
      .then(() => {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setThumbnail(client.config.imageBank || null)
              .setColor(Colors.Green)
              .setDescription(
                `### إشعار عملية ناجحة:\n* تم سحب رتبة ايقاف الخدمات للشخص (${us})`
              ),
          ],
        });
      })
      .catch(() => {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setThumbnail(client.config.imageBank || null)
              .setColor(Colors.Red)
              .setDescription(
                `### إشعار خطأ:\n* يوجد خطأ اثناء سحب الرتبة من الشخص، تأكد من الرتبة ومن الشخص انه داخل السيرفر`
              ),
          ],
        });
      });
  },
};
