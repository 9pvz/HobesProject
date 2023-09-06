const {
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  Colors,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  name: "ازالة_اموال",
  description: "إزالة اموال من عضو معين",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: ["إزالة_أموال", "إزالة_اموال"],
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
              `### إشعار خطأ:\n* تأكد من وضع المبلغ بالشكل الصحيح`
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
              `### إشعار خطأ:\n* تأكد من إضافة الشخص المراد اضافة المال إليه`
            ),
        ],
      });

    const one = new ButtonBuilder()
      .setCustomId("balance_remove_cash")
      .setLabel("المحفظة (الكاش)")
      .setStyle(ButtonStyle.Secondary);

    const two = new ButtonBuilder()
      .setCustomId("balance_remove_bank")
      .setLabel("البنك")
      .setStyle(ButtonStyle.Secondary);
    const three = new ButtonBuilder()
      .setCustomId("balance_remove_cancel")
      .setLabel("إلغــــــاء")
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder().addComponents(one, two, three);

    const one2 = new ButtonBuilder()
      .setCustomId("balance_remove_cash")
      .setLabel("المحفظة (الكاش)")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);

    const two2 = new ButtonBuilder()
      .setCustomId("balance_remove_bank")
      .setLabel("البنك")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);
    const three2 = new ButtonBuilder()
      .setCustomId("balance_remove_cancel")
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
            `## ⚠️ إجراء مطلوب:\n* يجب تحديد المكان المراد إزالة المال منه`
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
        if (i.customId === "balance_remove_cash") {
          await i.deferUpdate();
          await client.db.sub(`cash_${us?.id}`, Number(bal));
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
                  `### إشعار إزالة مال (كاش):\n* تم إضافة المبلغ (\`$${bal}\`) الى ${us}\n* رصيده الحالي في الكاش:\`$${newCash}\``
                ),
            ],
            components: [],
          });
        }
        if (i.customId === "balance_remove_bank") {
          await i.deferUpdate();
          await client.db.sub(`bank_${us?.id}.balance`, Number(bal));
          let newBank = await client.db.get(`bank_${us?.id}`);
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
                  `### إشعار إزالة مال (بنك):\n* تم إزالة المبلغ (\`$${bal}\`) الى ${us}\n* رصيده الحالي في البنك:\`$${newBank}\``
                ),
            ],
            components: [],
          });
        }
        if (i.customId === "balance_remove_cancel") {
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
