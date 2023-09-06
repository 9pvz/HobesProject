const {
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  Colors,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "ارسال",
  description: "ارسال رسالة لشخص مُعين من قِبل الادارة",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: ["إرسال", "أرسال"],
  onlyCustomRole: true,
  run: async (client, message, args) => {
    let user = message.mentions.members.first()?.id || args[0];
    let us = await message.guild.members.cache.get(user);
                if (!message.member.roles.cache.has(client.config.roles.امر_ارسال)) return;

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
            .setDescription(`### إشعار خطأ:\n* تأكد من إضافة الشخص `),
        ],
      });

    await us
      .send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.White)
            .setTitle(`**__رسـالـه وارده مـن وزارة الـداخـليـة__**`)
            .setDescription(`${args.slice(1).join(" ")}`),
        ],
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
              .setDescription(`### إشعار خطأ:\n* يوجد خطأ اثناء الارسال`),
          ],
        });
      });
    return await message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.White)
          .setDescription(`## اشعار:\n* تم إرسال الرسالة بنجاح .`),
      ],
    });
  },
};
