const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
  name: "تحويل",
  description: "تحويل مبلغ من البنك الى شخص آخر",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: [],
  noPausedUse: true,
  run: async (client, message, args) => {
    let user = message.mentions.users.first()?.id || args[0];

    let us = await client.users.cache.get(user);
    let bal = args[1];
    let traBank = await client.db.get(`bank_${message.author.id}`);
    let frsBank = await client.db.get(`bank_${us?.id}`);
    if (isNaN(bal))
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
    
    if (us?.id === message.author.id)
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
              `**__لا يـمـكـنـك الـتـحـويـل لـنـفـسك <:pp186:1122497135049445427> __**`
            ),
        ],
      });
    if (traBank?.status == false || !traBank)
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
              `**__لـيـس لـديـك حـسـاب بـنـكـي او انـه غـيـر مـفـعـل <:pp186:1122497135049445427> __**`
            ),
        ],
      });
    if (frsBank?.status == false || !frsBank)
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
              `**__الـشـخـص لا يـمـلـك حـسـاب بـنـكـي او حـسـابـه غـيـر مـفـعـل <:pp186:1122497135049445427>__**`
            ),
        ],
      });

    if (traBank?.balance < bal)
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
`**__نـعـتـذر رصـيـدك غـيـر كـافـي <:pp186:1122497135049445427>__**`

),
        ],
      });

    await client.db.sub(`bank_${message.author.id}.balance`, Number(bal));
    await client.db.add(`bank_${us?.id}.balance`, Number(bal));
    let newBank = await client.db.get(`bank_${message.author.id}.balance`);
    await us?.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.White)
          .setDescription(
            `**__<:emoji_215:1122296114360627270> – أهـلآ بـك فـي مـصـرف الـراجـحـي . __**

**__<:pp721:1122478518203334657> – ${message.author} : حـوالـه وارده مـن__**

**__ <:pp300:1122295572209078423> - ${bal} : الـمـبـلـغ . __**`
          ),
      ],
    });

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
            `**__<:emoji_215:1122296114360627270> – أهـلآ بـك فـي مـصـرف الـراجـحـي . __**

**__<a:emoji_8:1122560519967092786> – ايـصـال عـمـلـيـة تـحـويـل . __**        

**__<:pp300:1122295572209078423> – تـحـويـل مـبـلـغ . __**        

**__<:pp721:1122478518203334657> – ${us} : الـمـحـول لـه . __**        
        
**__<:pp943:1122294693611458630> – ( ${bal} ) : الـمـبـلـغ الـذي تـم تـحـويـلـه . __**`
          ),
      ],
    });
  },
};
