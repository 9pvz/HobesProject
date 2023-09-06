const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
  name: "سجل",
  description: "معلومات عن السجل المدني",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: ["السجل_المدني"],
  noPausedUse: true,
  run: async (client, message, args) => {
    let member =
      message.mentions.members.first() ||
      (await message.guild.members.cache.get(args[0])) ||
      message.author;
    let segel = await client.db.get(`segel_${member?.id}`);
    if (!segel)
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
              `### إشعار خطأ:\n* بيانات السجل المدني غير متاحة ..`
            ),
        ],
      });

    await message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp()
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.White)
          .setDescription(`### معلومات السجل المدني: ${member}`)
          .addFields(
            {
              name: "الحالة الجنائية:",
              value: `\`${segel?.halh}\``,
              inline: false,
            },
            {
              name: "عدد مرات دخول السجن:",
              value: `\`${segel?.sgnCount}\``,
              inline: false,
            },
            {
              name: "السوابق الجنائية:",
              value: `\`${segel?.swabep}\``,
              inline: false,
            },
            {
              name: "الحالة الوظيفية:",
              value: `\`${segel?.work}\``,
              inline: false,
            },
            {
              name: "عدد الرحلات:",
              value: `\`${segel?.vists || 0}\``,
              inline: false,
            }
          )
          .setFooter({
            text: message.guild.name,
            iconURL: message.guild.iconURL({ dynamic: true }),
          }),
      ],
    });
  },
};
