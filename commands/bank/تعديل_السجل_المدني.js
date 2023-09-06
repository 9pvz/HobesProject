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
  name: "تعديل",
  description: "تعديل سجل مدني لمواطن",
  userPerms: [],
  category: "bank",
  botPerms: [],
  onlyCustomRole: true,
  aliases: [],
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
    if (!segel)
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
            .setColor(Colors.Yellow)
            .setDescription(
              `### إشعار خطأ:\n* الشخص لا يملك سجل مدني مُسبقًا ..`
            ),
        ],
      });

    const modal = new ModalBuilder()
      .setCustomId("segel_edit_modal")
      .setTitle("تعديل السجل المدني");

    const segel_edit_modalSwabep = new TextInputBuilder()
      .setCustomId("segel_edit_modalSwabep")
      .setLabel("السوابق الجنائية")
      .setValue(segel?.swabep ?? null)
      .setStyle(TextInputStyle.Paragraph);

    const segel_edit_modalSgnCount = new TextInputBuilder()
      .setCustomId("segel_edit_modalSgnCount")
      .setLabel("عدد مرات دخول السجن")
      .setValue(segel?.sgnCount ?? null)
      .setStyle(TextInputStyle.Short);
    const segel_edit_modalHalh = new TextInputBuilder()
      .setCustomId("segel_edit_modalHalh")
      .setValue(segel?.halh ?? null)
      .setLabel("الحالة الجنائية")
      .setStyle(TextInputStyle.Paragraph);
    const segel_edit_modalWork = new TextInputBuilder()
      .setCustomId("segel_edit_modalWork")
      .setValue(segel?.work ?? null)
      .setLabel("الوظيفة")
      .setStyle(TextInputStyle.Paragraph);

    modal.addComponents(
      new ActionRowBuilder().addComponents(segel_edit_modalSwabep),
      new ActionRowBuilder().addComponents(segel_edit_modalSgnCount),
      new ActionRowBuilder().addComponents(segel_edit_modalHalh),
      new ActionRowBuilder().addComponents(segel_edit_modalWork)
    );
    let msg = await message.reply({
      content: "> **يرجى تعديل البيانات من الاستبيان ..**",
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("segel_modal_show1_button")
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
        if (i.customId === "segel_modal_show1_button") {
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
      if (i.customId === "segel_edit_modal") {
        let segel_edit_modalSwabep = i.fields.getTextInputValue(
          "segel_edit_modalSwabep"
        );
        let segel_edit_modalSgnCount = i.fields.getTextInputValue(
          "segel_edit_modalSgnCount"
        );
        let segel_edit_modalHalh = i.fields.getTextInputValue(
          "segel_edit_modalHalh"
        );
        let segel_edit_modalWork = i.fields.getTextInputValue(
          "segel_edit_modalWork"
        );
        await client.db.set(`segel_${member?.id}`, {
          swabep: segel_edit_modalSwabep,
          sgnCount: segel_edit_modalSgnCount,
          halh: segel_edit_modalHalh,
          work: segel_edit_modalWork,
          vists: segel?.vists || 0,
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
                  value: segel_edit_modalSwabep,
                  inline: true,
                },
                {
                  name: "عدد مرات دخول السجن:",
                  value: segel_edit_modalSgnCount,
                  inline: true,
                },
                {
                  name: "الحالة الجنائية:",
                  value: segel_edit_modalHalh,
                  inline: true,
                },
                {
                  name: "الوظيفة:",
                  value: segel_edit_modalWork,
                  inline: true,
                }
              ),
          ],
        });
      }
    });
  },
};
