const {
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  Colors,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "اضافة_اموال",
  description: "إضافة اموال لعضو معين",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: ["إضافة_اموال", "إضافة_أموال"],
  onlyCustomRole: true,
  run: async (client, message, args) => {
    let user = message.mentions.users.first()?.id || args[0];
    let us = await client.users.cache.get(user);
    let bal = args[1];
                    if (!message.member.roles.cache.has(client.config.roles.تحكم_الاموال)) return;

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
              `### إشـعـار خـطـأ:\n* **تـأكـد مـن وضـع الـمـبـلـغ بالـشـكـل الـصـحـيـح**`
            ),
        ],
      });
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
              `### إشـعـار خـطـأ :\n* **تـأكـد مـن إضـافـة الـشـخـص الـمـراد اضـافـة الـمـال إلـيـه**`
            ),
        ],
      });

    const one = new ButtonBuilder()
      .setCustomId("balance_add_cash")
      .setLabel("الـكـاش")
      .setStyle(ButtonStyle.Secondary);

    const two = new ButtonBuilder()
      .setCustomId("balance_add_bank")
      .setLabel("الـبـنـك")
      .setStyle(ButtonStyle.Secondary);
    const three = new ButtonBuilder()
      .setCustomId("balance_add_cancel")
      .setLabel("إلـغـاء")
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder().addComponents(one, two, three);

    const one2 = new ButtonBuilder()
      .setCustomId("balance_add_cash")
      .setLabel("الـكـاش")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);

    const two2 = new ButtonBuilder()
      .setCustomId("balance_add_bank")
      .setLabel("الـبـنـك")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);
    const three2 = new ButtonBuilder()
      .setCustomId("balance_add_cancel")
      .setLabel("إلـغـاء")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);
    const rowDisabled = new ActionRowBuilder().addComponents(
      one2,
      two2,
      three2
    );

    let msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.tag,
            iconURL: message.author.displayAvatarURL({ dyanmic: true }),
          })
          .setColor([254, 231, 92])
          .setThumbnail(client.config.imageBank || null)
          .setDescription(
            `## ⚠️ إجراء مطلوب:\n* **مـنـشـن الـعـضـو**`
          )
          .setFooter({
            text: `${message.guild.name}`,
            iconURL: message.guild.iconURL({ dyanmic: true }),
          }),
      ],
      components: [row],
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id === message.author.id) {
        if (i.customId === "balance_add_cash") {
          await i.deferUpdate();
          await client.db.add(`cash_${us?.id}`, Number(bal));
          let newCash = await client.db.get(`cash_${us?.id}`);
          return await msg.edit({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(client.config.imageBank || null)
                .setColor(client.config.color || Colors.Green)
                .setDescription(
                  `** - تـم اضـافـة لـ ( ${us} ) مـبـلـغ وقـدره ( ${bal} ) 
مـع تـمـنـيـاتـنـا لـك بـالـتـوفـيـق**`
                ),
            ],
            components: [],
          });
        }
        if (i.customId === "balance_add_bank") {
          await i.deferUpdate();
          await client.db.add(`bank_${us?.id}.balance`, Number(bal));
          let newBank = await client.db.get(`bank_${us?.id}.balance`);
          return await msg.edit({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(client.config.imageBank || null)
                .setColor(client.config.color || Colors.Green)
                .setDescription(
                  `** - تـم اضـافـة لـ ( ${us} ) مـبـلـغ وقـدره ( ${bal} ) 
مـع تـمـنـيـاتـنـا لـك بـالـتـوفـيـق**`
                ),
            ],
            components: [],
          });
        }
        if (i.customId === "balance_add_cancel") {
          await i.deferUpdate();
          return await msg.edit({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(client.config.imageBank || null)
                .setColor(client.config.color || Colors.White)
                .setDescription(`### تـنـبـيـة:\n* تـم إلـغـاء الـعـمـلـيـة بـنـجـاح`),
            ],
            components: [],
          });
        }
      } else {
        i.reply({
          content: `These buttons aren't for you!`,
          ephemeral: true,
        });
      }
    });

    collector.on("end", (collected) => {
      if (collected.size > 0) return;
      msg.edit({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.tag,
              iconURL: message.author.displayAvatarURL({
                dyanmic: true,
              }),
            })
            .setColor([254, 231, 92])
            .setThumbnail(client.config.imageBank || null)
            .setDescription(`⚠️ انـتـهـى وقـت هـذه الـعـمـلـيـة`)
            .setFooter({
              text: `${message.guild.name}`,
              iconURL: message.guild.iconURL({ dyanmic: true }),
            }),
        ],
        components: [rowDisabled],
      });
    });
  },
};
