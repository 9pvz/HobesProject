const {
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  Colors,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "ايقاف_خدمات",
  description: "ايقاف خدمات شخص معين",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: ["ايقاف-خدمات"],
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
              `### إشعار خطأ:\n* تأكد من إضافة الشخص المراد اضافة رتبة ايقاف الخدمات`
            ),
        ],
      });

    await us.roles
      .add(client.config.rolePaused)
      .then(() => {
        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.White)
              .setDescription(
                `### عـمـليـه نـاجـحـه:\n***تم ايقاف خدمات ( ${us} ) المواطن لرفع ايقاف الخدمات الرجاء مراجعت مكتب الماليه**`
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
                `### إشعار خطأ:\n* يوجد خطأ اثناء اعطاء الشخص الرتبة، تأكد من الرتبة ومن الشخص انه داخل السيرفر`
              ),
          ],
        });
      });
  },
};
