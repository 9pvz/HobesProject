const {
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  MessageCollector,
  ComponentType,
} = require("discord.js");

module.exports = {
  name: "مخالفة",
  description: "مخالفة شخص مخالف",
  userPerms: [],
  category: "bank",
  botPerms: [],
  onlyCustomRole: true,
  aliases: ["المخالفات", "مخالفه", "المخالفات_المرورية"],
  run: async (client, message, args) => {
    let member =
      message.mentions.members.first() ||
      (await message.guild.members.cache.get(args[0]));
    let bank = await client.db.get(`bank_${member?.id}`);
            if (!message.member.roles.cache.has(client.config.roles.المخالفات_والسجل)) return;
    if (bank?.status == false || !bank)
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
              `### إشعار خطأ:\n* الحساب البنكي غير مُفعل، تواصل مع المسؤولين ليتم التفعيل.`
            ),
        ],
      });
    const menuOptions = client.config.violations.map((item, index) => ({
      label: item?.title,
      description: `الـغـرامـة: ${item?.price}`,
      value: `violations_${index + 1}`,
    }));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("big_select_menu1")
      .setPlaceholder("اخـتـار الـمـخـالـفـة")
      .addOptions(menuOptions);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    let msg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp()
          .setThumbnail(client.config.sadadLaga || null)
          .setColor(client.config.color || Colors.White)
          .setDescription(
            `### إشـعـار : \n* قـم بـإخـتـيـار الـمـخـالـفـة مـن الـقـائـمـة فـي الأسـفـل`
          ),
      ],
      components: [row],
    });
    const filter = (interaction) =>
      interaction.customId === "big_select_menu1" &&
      interaction.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter,
      time: 15000,
    });

    collector.on("collect", async (interaction) => {
      const selectedValue = interaction.values[0];
      const index = parseInt(selectedValue.split("_")[1]) - 1;

      if (
        !isNaN(index) &&
        index >= 0 &&
        index < client.config.violations.length
      ) {
        const selectedObject = client.config.violations[index];
        const price = selectedObject.price;
        await interaction.deferUpdate();
        const customID = generateCustomID();
        let lostVols = await client.db.get(`violations_${member?.id}`);
        if (lostVols) {
          await client.db.push(`violations_${member?.id}`, {
            id: customID,
            name: selectedObject?.title,
            price: price,
            mod: message.author.id,
            date: new Date().toLocaleDateString(),
          });
        } else {
          await client.db.set(`violations_${member?.id}`, [
            {
              id: customID,
              name: selectedObject?.title,
              price: price,
              mod: message.author.id,
              date: new Date().toLocaleDateString(),
            },
          ]);
        }
        await member?.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
          .setThumbnail(client.config.sadadLaga || null)
          .setColor(client.config.color || Colors.White)
              .setDescription(
                `**__ تـم قـيـد مـخـالـفـه - <:IMG_6116:1136505822948626432> __**

**__الـعـسـكـري : ${message.author} - <:20230805_194219:1137765054637424681> __**

**__نوع المخالفة : ${selectedObject?.title} - <:pp943:1122294693611458630> __**

**__الـمـبـلـغ : ${price} - <:pp783:1122498483560132668> __**

**__نـوع الـمـخـالـفـه : باشر - <:pp300:1122295572209078423> __** 

**__سـارع فـي تـسـديـد الـمـخـالـفـه تـجـنـب لايـقـاف الـخـدمـات - <a:pp483:1122302146839314463> __**`
              ),
          ],
        });
        await msg.edit({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
          .setThumbnail(client.config.sadadLaga || null)
          .setColor(client.config.color || Colors.Green)
          .setDescription(
`**__رصـد مـخالـفـة - <:IMG_6116:1136505822948626432> __**
                
**__الـمـخـالـف : ${member} - <:pp721:1122478518203334657> __**

**__الـعـسـكـري : ${message.author} - <:20230805_194219:1137765054637424681>__**

**__نـوع الـمـخـالـفـة : ${selectedObject?.title} - <:pp943:1122294693611458630>__**

**__الـمـبـلـغ : ${price} - <:pp783:1122498483560132668> __**`
              ),
          ],
          components: [],
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
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.Green)
            .setDescription(`### تـنـبـيـة : \n* انـتـهـى الـوقـت لـلإخـتـيـار، يـرجـى الإعـادة`),
        ],
        components: [],
      });
    });
  },
};

function generateCustomID() {
  const characters = "0123456789";
  let customID = "";
  const idLength = 8;

  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    customID += characters[randomIndex];
  }

  return customID;
}
