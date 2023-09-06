const {
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  Colors,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "تصفير_الكل",
  description: "تصفير كل اموال الاشخاص",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: ["تصفير_ألكل"],
  onlyCustomRole: true,
  run: async (client, message, args) => {
    if (!message.member.roles.cache.has(client.config.roles.اوامر_التصفير)) return;
    const one = new ButtonBuilder()
      .setCustomId("balance_removeall1_cash")
      .setLabel("المحفظة (الكاش)")
      .setStyle(ButtonStyle.Secondary);

    const two = new ButtonBuilder()
      .setCustomId("balance_removeall1_bank")
      .setLabel("البنك")
      .setStyle(ButtonStyle.Secondary);
    const four = new ButtonBuilder()
      .setCustomId("balance_removeall1_all")
      .setLabel("الكل")
      .setStyle(ButtonStyle.Danger);
    const three = new ButtonBuilder()
      .setCustomId("balance_removeall1_cancel")
      .setLabel("إلغــــــاء")
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder().addComponents(one, two, four, three);

    const one2 = new ButtonBuilder()
      .setCustomId("balance_removeall1_cash")
      .setLabel("المحفظة (الكاش)")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);
    const four2 = new ButtonBuilder()
      .setCustomId("balance_removeall1_all")
      .setLabel("الكل")
      .setDisabled(true)
      .setStyle(ButtonStyle.Danger);
    const two2 = new ButtonBuilder()
      .setCustomId("balance_removeall1_bank")
      .setLabel("البنك")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);
    const three2 = new ButtonBuilder()
      .setCustomId("balance_removeall1_cancel")
      .setLabel("إلغــــــاء")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);
    const rowDisabled = new ActionRowBuilder().addComponents(
      one2,
      two2,
      four2,
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
            `## ⚠️ إجراء مطلوب:\n* يجب تحديد المكان المراد إزالة كل المال منه`
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
        if (i.customId === "balance_removeall1_cash") {
          await i.deferUpdate();
          const allEntries = await client.db.all();
          const bankKeys = allEntries.filter((entry) =>
            entry.id.startsWith("cash_")
          );
          for (const entry of bankKeys) {
            await client.db.set(entry.id, 0);

          }
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
                  `### إشعار تصفير الكل (كاش):\n* تم إزالة كل المبلغ من كل الاعضاء المسجلين!`
                ),
            ],
            components: [],
          });
        }
        if (i.customId === "balance_removeall1_bank") {
          await i.deferUpdate();
          const allEntries = await client.db.all();
          const bankKeys = allEntries.filter((entry) =>
            entry.id.startsWith("bank_")
          );
          for (const entry of bankKeys) {
            await client.db.set(entry.id, { balance: 0, status: entry.value.status });
          }

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
                  `### إشعار تصفير الكل (البنك):\n* تم إزالة كل المبلغ من كل الاعضاء المسجلين!`
                ),
            ],
            components: [],
          });
        }
        if (i.customId === "balance_removeall1_all") {
          await i.deferUpdate();
          const allEntries = await client.db.all();
          const bankKeys = allEntries.filter((entry) =>
            entry.id.startsWith("bank_")
          );
          for (const entry of bankKeys) {
            console.log(entry)
            await client.db.set(entry.id, { balance: 0, status: entry.value.status });

          }

          const cashKeys = allEntries.filter((entry) =>
            entry.id.startsWith("cash_")
          );
          for (const entry of cashKeys) {
            await client.db.set(entry.id, 0);
          }

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
                  `**__– عـزيـزي المـسـؤول .

:emoji_224: - تـم تـصـفـيـر جـمـيـع الأمـوال مـن بـنـك الـمـديـنـة الـكـبـيـرة بـالـكـامـل :pp372: .

مـع تـمـنـيـاتـنـا لـك بـالـتـوفـيـق - __**`
                ),
            ],
            components: [],
          });
        }
        if (i.customId === "balance_removeall1_cancel") {
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
                .setDescription(`### تنبية:\n* تم إلغاء العملية بنجاح`),
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
            .setDescription(`⚠️ انتهى وقت هذه العملية!`)
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
