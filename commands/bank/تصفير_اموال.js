const {
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  Colors,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "تصفير_اموال",
  description: "تصفير كل اموال الشخص",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: ["تصفير_أموال"],
  onlyCustomRole: true,
  run: async (client, message, args) => {
    let user = message.mentions.users.first()?.id || args[0];
    let us = await client.users.cache.get(user);
                if (!message.member.roles.cache.has(client.config.roles.اوامر_التصفير)) return;
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
              `### إشعار خطأ:\n* تأكد من إضافة الشخص المراد إزالة كل المال منه`
            ),
        ],
      });

    const one = new ButtonBuilder()
      .setCustomId("balance_removeall_cash")
      .setLabel("المحفظة (الكاش)")
      .setStyle(ButtonStyle.Secondary);

    const two = new ButtonBuilder()
      .setCustomId("balance_removeall_bank")
      .setLabel("البنك")
      .setStyle(ButtonStyle.Secondary);
    const three = new ButtonBuilder()
      .setCustomId("balance_removeall_cancel")
      .setLabel("إلغــــــاء")
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder().addComponents(one, two, three);

    const one2 = new ButtonBuilder()
      .setCustomId("balance_removeall_cash")
      .setLabel("المحفظة (الكاش)")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);

    const two2 = new ButtonBuilder()
      .setCustomId("balance_removeall_bank")
      .setLabel("البنك")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);
    const three2 = new ButtonBuilder()
      .setCustomId("balance_removeall_cancel")
      .setLabel("إلغــــــاء")
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
        if (i.customId === "balance_removeall_cash") {
          await i.deferUpdate();
          let bal = await client.db.get(`cash_${us?.id}`);
          await client.db.set(`cash_${us?.id}`, 0);
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
                  `### إشعار إزالة مال (كاش):\n* تم إزالة المبلغ (\`$${bal}\`) من ${us}`
                ),
            ],
            components: [],
          });
        }
        if (i.customId === "balance_removeall_bank") {
          await i.deferUpdate();
          let bal = await client.db.get(`bank_${us?.id}`);
          await client.db.set(`bank_${us?.id}.balance`, 0);
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
                  `### إشعار إزالة كل المال (بنك):\n* تم إزالة المبلغ (\`$${bal}\`) من ${us}`
                ),
            ],
            components: [],
          });
        }
        if (i.customId === "balance_removeall_cancel") {
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
