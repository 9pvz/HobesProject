const {
  EmbedBuilder,
  Colors,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "توزيع_الرواتب",
  description: "الحصول على الراتب اليومي",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: [],
  onlyCustomRole: true,
  run: async (client, message, args) => {
    let roles = client.config.ratebRoles;
    let deposits = [];
    if (!message.member.roles.cache.has(client.config.roles.توزيع_الرواتب)) return;

    const confirm = new ButtonBuilder()
      .setCustomId("confirm_salary1_add")
      .setLabel("تأكيد")
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel_salary1_add")
      .setLabel("إلغاء")
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder().addComponents(confirm, cancel);

    const confirm2 = new ButtonBuilder()
      .setCustomId("confirm_salary1_add")
      .setLabel("تأكيد")
      .setDisabled(true)

      .setStyle(ButtonStyle.Danger);

    const cancel2 = new ButtonBuilder()
      .setCustomId("cancel_salary1_add")
      .setLabel("إلغاء")
      .setDisabled(true)
      .setStyle(ButtonStyle.Secondary);
    const rowDisabled = new ActionRowBuilder().addComponents(confirm2, cancel2);

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
            `## ⚠️ تأكيد العملية:\n* يجب الضغط على زر **تأكيد** لإستكمال تسليم الرواتب!`
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
        if (i.customId === "confirm_salary1_add") {
          await i.deferUpdate();
          for (const role of roles) {
            let r = await message.guild.roles.cache.get(role?.id);
            let s = role?.salary;
                      (await message.guild.members.fetch()).forEach(async (member) => {
            if (member.roles.cache.some(rr => rr.id === r.id)) {
              let dddd = await client.db.get(`bank_${member?.id}`)
              if (!dddd) {
                    await client.db.set(`bank_${member.id}`, {
                      balance: s,
                      status: true,
                    })   
              } else {
                  await client.db.add(`bank_${member?.id}.balance`, s)
              }
            }
          })

            deposits.push({
              role: r,
              salary: s,
            });
          }

          let fields = deposits.map((deposit) => ({
            name: "**__الـرتـبـة:__**",
            value: `**__* <@&${deposit.role.id}> (${deposit.salary})__**`,
            inline: false,
          }));

          return await msg.edit({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(client.config.imageBank || null)
                .setColor(client.config.color || Colors.White)
                .setDescription(`## إشعار الإيداع:\nتم اضافة الراتب لكل الرتب!`)
                .addFields(fields),
            ],
            components: [],
          });
        }
        if (i.customId === "cancel_salary1_add") {
          await i.deferUpdate();
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
                .setDescription(`**:x: تم إلغاء العملية!**`)
                .setFooter({
                  text: `${message.guild.name}`,
                  iconURL: message.guild.iconURL({ dyanmic: true }),
                }),
            ],
            components: [rowDisabled],
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
