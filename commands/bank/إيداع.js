const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
  name: "إيداع",
  description: "إيداع مبلغ من الكاش الى البنك",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: ["ايداع"],
  noPausedUse: true,
  run: async (client, message, args) => {
    let bal = args[0];
    let cash = (await client.db.get(`cash_${message.author.id}`)) || 0;
    
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
    if (cash < bal)
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
              `**__نـعـتـذر الـمـبـلـغ غـيـر مـتـوفــر فـي الـكـاش <:pp186:1122497135049445427>__**`
            ),
        ],
      });
    await client.db.sub(`cash_${message.author.id}`, Number(bal));
    await client.db.add(`bank_${message.author.id}.balance`, Number(bal));
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
            `**__<:emoji_215:1122296114360627270> –أهـلآ بـك فـي مـصـرف الـراجـحـي .

<a:emoji_8:1122560519967092786> - تـم الأيـداع بـنـجـاح .

<:pp943:1122294693611458630> - الـمـبـلـغ الـذي تـم ايـداعـه : ( ${bal} ) .__**`
          ),
      ],
    });
  },
};
