const {
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  MessageCollector,
  ComponentType,
  TextInputStyle,
  ModalBuilder,
  TextInputBuilder,
  ButtonBuilder,
  ButtonStyle,
  InteractionType,
} = require("discord.js");

module.exports = {
  name: "انشاء",
  description: "انشاء سجل مدني لمواطن",
  userPerms: [],
  category: "bank",
  botPerms: [],
  onlyCustomRole: true,
  aliases: ["إنشاء", "أنشاء"],
  run: async (client, message, args) => {
    let member =
      message.mentions.members.first() ||
      (await message.guild.members.cache.get(args[0]));
    let segel = await client.db.get(`segel_${member?.id}`);
            if (!message.member.roles.cache.has(client.config.roles.المخالفات_والسجل)) return;
    if (!member)
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
            .setColor(Colors.DarkRed)
            .setDescription(`### إشعار خطأ:\n* تأكد من الشخص`),
        ],
      });
    if (segel)
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
            .setColor(Colors.Yellow)
            .setDescription(`### إشعار خطأ:\n* الشخص يملك سجل مدني مُسبقًا ..`),
        ],
      });

    const modal = new ModalBuilder()
      .setCustomId("segel_create_modal")
      .setTitle("انشاء السجل المدني");

    const segel_create_modalSwabep = new TextInputBuilder()
      .setCustomId("segel_create_modalSwabep")
      .setLabel("السوابق الجنائية")
      .setStyle(TextInputStyle.Paragraph);

    const segel_create_modalSgnCount = new TextInputBuilder()
      .setCustomId("segel_create_modalSgnCount")
      .setLabel("عدد مرات دخول السجن")
      .setStyle(TextInputStyle.Short);
    const segel_create_modalHalh = new TextInputBuilder()
      .setCustomId("segel_create_modalHalh")
      .setLabel("الحالة الجنائية")
      .setStyle(TextInputStyle.Paragraph);
    const segel_create_modalWork = new TextInputBuilder()
      .setCustomId("segel_create_modalWork")
      .setLabel("الوظيفة")
      .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(
      new ActionRowBuilder().addComponents(segel_create_modalSwabep),
      new ActionRowBuilder().addComponents(segel_create_modalSgnCount),
      new ActionRowBuilder().addComponents(segel_create_modalHalh),
      new ActionRowBuilder().addComponents(segel_create_modalWork)
    );
    let msg = await message.reply({
      content: "> **يرجى املاء البيانات من الاستبيان ..**",
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("segel_modal_show_button")
            .setLabel(`إظهار الاستبيان`)
            .setStyle(ButtonStyle.Secondary)
        ),
      ],
    });

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id === message.author.id) {
        if (i.customId === "segel_modal_show_button") {
          await i.showModal(modal);
        }
      } else {
        i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
      }
    });

    collector.on("end", (collected) => {
      if (collected.size > 0) return;
    });
    client.on("interactionCreate", async (i) => {
      if (!i.type === InteractionType.ModalSubmit) return;
      if (i.customId === "segel_create_modal") {
        let segel_create_modalSwabep = i.fields.getTextInputValue(
          "segel_create_modalSwabep"
        );
        let segel_create_modalSgnCount = i.fields.getTextInputValue(
          "segel_create_modalSgnCount"
        );
        let segel_create_modalHalh = i.fields.getTextInputValue(
          "segel_create_modalHalh"
        );
        let segel_create_modalWork = i.fields.getTextInputValue(
          "segel_create_modalWork"
        );
        await client.db.set(`segel_${member?.id}`, {
          swabep: segel_create_modalSwabep,
          sgnCount: segel_create_modalSgnCount,
          halh: segel_create_modalHalh,
          work: segel_create_modalWork,
        });
        await i.reply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: message.author.username,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
              })
              .setThumbnail(client.config.imageBank || null)
              .setColor(Colors.Yellow)
              .setDescription(
                `### إشعار نجاح عملية:\n* تم تسجيل بيانات الشخص (${member}) في السجل المدني ..`
              )
              .addFields(
                {
                  name: "السوابق الجنائية:",
                  value: segel_create_modalSwabep,
                  inline: true,
                },
                {
                  name: "عدد مرات دخول السجن:",
                  value: segel_create_modalSgnCount,
                  inline: true,
                },
                {
                  name: "الحالة الجنائية:",
                  value: segel_create_modalHalh,
                  inline: true,
                },
                {
                  name: "الوظيفة:",
                  value: segel_create_modalWork,
                  inline: true,
                }
              ),
          ],
        });
      }
    });
  },
};
