const {
  EmbedBuilder,
  Colors,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "راتب",
  description: "توزيع راتب لرتبة معينة",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: [],
  run: async (client, message, args) => {
    let customRole = message.mentions.roles.first()?.id || args[0];
    let salary = parseInt(args[1]);
    let role = await message.guild.roles.cache.get(customRole);
    if (!message.member.roles.cache.has(client.config.roles.امر_رواتب)) return;
    if (!role)
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
            .setColor(Colors.DarkRed)
            .setDescription(`__**يـجـب عـلـيـك تـحـديـد الـرتـبـه ثـمـه الـمـبـلـغ__**`),
        ],
      });
    if (isNaN(salary))
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
            .setColor(Colors.DarkRed)
            .setDescription(`**__ تـاكـد مـن وضـع الـمـبـلـغ بـشـكـل صـحـيـح <a:WOLF107:1122295848701800588> __**`),
        ],
      });
    const confirm = new ButtonBuilder()
      .setCustomId("confirm_salary_add")
      .setLabel("تـأكـيـد")
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel_salary_add")
      .setLabel("إلـغـاء")
      .setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder().addComponents(confirm, cancel);

    const confirm2 = new ButtonBuilder()
      .setCustomId("confirm_salary_add")
      .setLabel("تـأكــيد")
      .setDisabled(true)

      .setStyle(ButtonStyle.Danger);

    const cancel2 = new ButtonBuilder()
      .setCustomId("cancel_salary_add")
      .setLabel("إلـغـاء")
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
          .setColor(client.config.color || Colors.White)
          .setDescription(
            `## <:pp186:1122497135049445427> تـأكـيـد الـعـمليــة:\n* **يـجـب الـضـغـط عـلـى زر تـأكــيد لإسـتـكـمال تـسـلـيـم الـراتـب**`
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
        if (i.customId === "confirm_salary_add") {
          await i.deferUpdate();
          let okAdded = 0;
          let okNotAdded = 0;
          let addPromises = [];
          (await message.guild.members.fetch()).forEach(async (member) => {
            if (member.roles.cache.some(rr => rr.id === role.id)) {
              let dddd = await client.db.get(`bank_${member?.id}`)
              if (!dddd || dddd.status === false) {
                try {
                  addPromises.push(
                    await client.db.set(`bank_${member.id}`, {
                      balance: salary,
                      status: true,
                    })
                  );
                  okAdded++;
                } catch {
                  okNotAdded--;
                }
              } else {
                try {
                  addPromises.push(await client.db.add(`bank_${member?.id}.balance`, salary));
                  okAdded++;
                } catch {
                  okNotAdded++;
                }
              }

            }
          })


          return await msg.edit({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(client.config.imageBank || null)
                .setColor(client.config.color || Colors.White)
                .setDescription(
                  `** __– عـزيـزي الـعـضـو :<: IMG_6116: 1136505822948626432 > .

 تـم  صـرف  راتـب  هـذا  الاسـبـوع  لـ  رتـبـة(${role})  وقـدرة(${salary})  مـع تـمـنـيـاتـنـا  لـك  بـالـتـوفـيـق.

(وزارة المالية) __ ** `
                ),
            ],
            components: [],
          });
        }
        if (i.customId === "cancel_salary_add") {
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
                .setDescription(`**: x: تم إلغاء العملية! ** `)
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
            .setColor(client.config.color || Colors.White)
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
