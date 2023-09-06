const {
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "سداد",
  description: "نـظـام سـداد لـلـمـدفـوعاـت",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: ["تسديد"],
  run: async (client, message, args) => {
    let vio = await client.db.get(`violations_${message.author.id}`);
    let bank = await client.db.get(`bank_${message.author.id}`);

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("big_select_menu2")
      .setPlaceholder("اختر الجهة المعنية للسداد")
      .addOptions([
        {
          label: "الـمـخـالـفـات الـمـروريـة",
          description: `مـعـرفـة وسـداد الـمـخـالـفـات الـمـروريـة`,
          value: `sadad_moror`,
        },
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);
    let msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(client.config.sadadLogo || null)
          .setColor(client.config.color || Colors.White)
          .setDescription(
            `### إشـعـار : \n* قـم بـإخـتـيـار الـجـهـة الـمـعـنـيـة مـن الـقـائـمـة فـي الأسـفـل`
          ),
      ],
      components: [row],
    });
    const filter = (interaction) =>
      interaction.customId === "big_select_menu2" &&
      interaction.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter,
      time: 60000,
    });
    const collectorr = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (interaction) => interaction.user.id === message.author.id,
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      const selectedValue = interaction.values[0];

      if (selectedValue === "sadad_moror") {
        await interaction.deferUpdate();
        if (!vio)
          return await msg.edit({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(client.config.sadadLogo || null)
                .setColor(Colors.DarkRed)
                .setDescription(
                  `### إشـعـار خأطأ : \n* لا تـمـلـك اي مـخـالـفـات مـروريـة مـسـجـلـة`
                ),
            ],
            components: [],
          });
        let newCo = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("sadad_moror_all")
            .setLabel("سـداد جـمـيـع الـمـخـالـفـات")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("sadad_moror_custom")
            .setLabel("سـداد بـرقـم الـمـخـالـفـة")
            .setStyle(ButtonStyle.Secondary)
        );
        return await msg.edit({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
          .setThumbnail(client.config.sadadLogo || null)
          .setColor(client.config.color || Colors.White)
              .setDescription(`### إشـعـار : \n* نـرجـو مـنـك الإخـتـيـار فـي الأسـفـل ..`),
          ],
          components: [newCo],
        });
      } else {
        await interaction.reply({
          content: "> **إختيار خاطئ، تاكد من ذلك**",
          ephemeral: true,
        });
      }
    });

    collector.on("end", async (collected, reason) => {
      if (collected.size > 0) return;
      await msg.edit({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
          .setThumbnail(client.config.sadadLogo || null)
          .setColor(client.config.color || Colors.White)
            .setDescription(`### تـنـبـيـة : \n* انـتـهـى الـوقـت لـلإخـتـيـار، يـرجـى الإعـادة`),
        ],
        components: [],
      });
    });
    collectorr.on("collect", async (interaction) => {
      const totalPrice = vio.reduce((acc, item) => {
        const price = parseInt(item.price, 10);
        return acc + price;
      }, 0);
      if (interaction.customId === "sadad_moror_all") {
        await interaction.deferUpdate();
        let newCo = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("sadad_moror_all_confirm")
            .setLabel("مـوافـق")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId("sadad_moror_all_cancel")
            .setLabel("إلـغـاء")
            .setStyle(ButtonStyle.Secondary)
        );
        return await msg.edit({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
          .setThumbnail(client.config.sadadLogo || null)
          .setColor(client.config.color || Colors.White)
              .setDescription(
                `### إشعار :\n* **__ - عـزيـزي الـعـضـو مـجـموعـه مـخـالـفـتـك ( ${totalPrice} ) لـ اكـمـال الـسـداد مـوافـق __**`
              ),
          ],
          components: [newCo],
        });
      }
      if (interaction.customId === "sadad_moror_all_confirm") {
        if (bank?.balance < totalPrice)
          return await msg.edit({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setThumbnail(client.config.sadadLogo || null)
                .setColor(Colors.Red)
                .setDescription(
                  `### إشعار:\n* لا يمكن إتمام العملية، لا تملك المبلغ الكافي ..`
                ),
            ],
            components: [],
          });
        await client.db.sub(`bank_${message.author.id}.balance`, totalPrice);
        await client.db.delete(`violations_${message.author.id}`);
        return await msg.edit({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
          .setThumbnail(client.config.sadadLogo || null)
          .setColor(client.config.color || Colors.White)
              .setDescription(
                `**__### إشـعـار سـداد : \n* تـم سـداد الـمـخـالـفـات بـنـجـاح، نـشـكـر لـكـم ذلـك سـيـتـم إزالـتـهـا مـن سـجـلـك فـي اقـرب وقـت.__**`
              ),
          ],
          components: [],
        });
      }
      if (interaction.customId === "sadad_moror_all_cancel") {
        return await msg.edit({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
          .setThumbnail(client.config.sadadLogo || null)
          .setColor(client.config.color || Colors.White)
              .setDescription(`### إشعار : \n* **تـم إلـغـاء الـعـمـلـيـة بـنـجـاح ..**`),
          ],
          components: [],
        });
      }
      if (interaction.customId === "sadad_moror_custom") {
        await interaction.deferUpdate();
        await msg.edit({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
          .setThumbnail(client.config.sadadLogo || null)
          .setColor(client.config.color || Colors.White)
              .setDescription(
                `### إشـعـار:\n* **يـرجـى كـتـابـة رقـم الـمـخـالـفـة والـذي يـتـكـون مـن 8 ارقـام**`
              ),
          ],
          components: [],
        });
        const collectorFilter = (m) => m.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({
          filter: collectorFilter,
          time: 60000,
        });
        collector.on("collect", async (m) => {
          if (m.content.length > 8)
            return await msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                  })
          .setThumbnail(client.config.sadadLogo || null)
          .setColor(client.config.color || Colors.White)
                  .setDescription(
                    `### إشـعـار خـطـا:\n* **رقـم الـمـخـالـفـة يـتـكـون مـن 8 ارقـام فـقـط**`
                  ),
              ],
              components: [],
            });
          const allData = await client.db.startsWith("violations_");
          let foundIndex = -1;
          for (let i = 0; i < allData.length; i++) {
            if (allData[i].id === `violations_${m.author.id}`) {
              foundIndex = i;
              break;
            }
          }
          if (foundIndex == -1) {
            collector.stop();
            return await msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                  })
          .setThumbnail(client.config.sadadLogo || null)
          .setColor(client.config.color || Colors.White)
                  .setDescription(
                    `### إشـعـار خـطا : \n* لـم يـتـم ايـجـاد هـذه الـمـخـالـفـة او انـه مـسـجـلـه لـمـواطـن آخـر !`
                  ),
              ],
              components: [],
            });
          } else {
            const foundViolation = (
              await client.db.get(`violations_${m.author.id}`)
            ).find((violation) => violation.id === m.content);
            if (foundViolation?.price > bank?.balance) {
              collector.stop();
              return await msg.edit({
                embeds: [
                  new EmbedBuilder()
                    .setAuthor({
                      name: message.author.username,
                      iconURL: message.author.displayAvatarURL({
                        dynamic: true,
                      }),
                    })
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.White)
                    .setDescription(
                      `### إشعار خطا:\n* لا تـمـلـك الـمـبـلـغ الـكـافـي لـلـسـداد .`
                    ),
                ],
                components: [],
              });
            }

            const newData = (
              await client.db.get(`violations_${m.author.id}`)
            ).filter((violation) => violation.id !== m.content);
            await client.db.sub(
              `bank_${message.author.id}.balance`,
              foundViolation?.price
            );
            await client.db.set(`violations_${m.author.id}`, newData);

            collector.stop();
            await msg.edit({
              embeds: [
                new EmbedBuilder()
                  .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                  })
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.White)
                  .setDescription(`### إشـعـار سـداد : \n* **تـم سـداد الـمـخـالـفـة بـنـجـاح**`),
              ],
              components: [],
            });
          }
        });

        collector.on("end", async (collected) => {
          if (collected.size > 0) return;
          await msg.edit({
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: message.author.username,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
          .setThumbnail(client.config.sadadLogo || null)
          .setColor(client.config.color || Colors.White)
                .setDescription(
                  `### تـنـبـيـة : \n* انـتـهـى الـوقـت لـكـتـابـة رقـم الـمـخـالـفـة، يـرجـى الإعـادة`
                ),
            ],
            components: [],
          });
        });
      }
    });
  },
};