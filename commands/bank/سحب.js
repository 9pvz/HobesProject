const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
  name: "سحب",
  description: "سحب مبلغ من البنك الى الكاش",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: [],
  noPausedUse: true,
  run: async (client, message, args) => {
    let bal = args[0];
    let bank = await client.db.get(`bank_${message.author.id}`);
    if (isNaN(args[0]))
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
              `**__رجـاء قـم بـتـحـديـد رقـم صـالـح <:pp186:1122497135049445427>__**`
            ),
        ],
      });
    const pt = /^[*/+\-]/;
    if (pt.test(bal))
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
              `**__رجـاء قـم بـتـحـديـد رقـم صـالـح <:pp186:1122497135049445427>__**`
            ),
        ],
      });
    if (bank?.status === false)
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
              `### إشعار خطأ:\n* حسابك البنكي غير مُفعل، تواصل معي المسؤولين ليتم التفعيل.`
            ),
        ],
      });
    if (bank?.balance < bal)
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
            .setColor(Colors.DarkRed)
            .setDescription(`**__نـعـتـذر رصـيـدك غـيـر كـافـي <:pp186:1122497135049445427>__**`),
        ],
      });
    await client.db.sub(`bank_${message.author.id}.balance`, Number(bal));
    await client.db.add(`cash_${message.author.id}`, Number(bal));
    return await message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.Green)
          .setDescription(
            `**__<:emoji_215:1122296114360627270>  -أهـلآ بـك فـي مـصـرف الـراجـحـي .

<a:emoji_8:1122560519967092786> - تـم الـسـحـب بـنـجـاح .

<:pp943:1122294693611458630> - الـمـبـلـغ الـذي تـم سـحـبـه : ( ${bal} ) .__**`
          ),
      ],
    });
  },
};
