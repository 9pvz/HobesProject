const {
  EmbedBuilder,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");

module.exports = {
  name: "مخالفاتي",
  description: "معرفة جميع مخالفات",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: [],
  run: async (client, message, args) => {
        let user = message.mentions.users.first()?.id || args[0] || message.author.id;
    let member = await client.users.cache.get(user);
    let vio = await client.db.get(`violations_${member?.id}`);
    if (!vio || vio.length < 1)
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: member?.username,
              iconURL: member?.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
            .setColor(Colors.DarkRed)
            .setDescription(
              `### إشعار خطأ:\n* لا تملك اي مخالفات مرورية مسجلة`
            ),
        ],
      });
    function createResultsPages(results) {
      const pageSize = 5;
      const totalPages = Math.ceil(results.length / pageSize);
      const pages = [];
      for (let i = 0; i < totalPages; i++) {
        const startIndex = i * pageSize;
        const endIndex = startIndex + pageSize;
        const pageResults = results.slice(startIndex, endIndex);

        const pageContent = pageResults
          .map(
            (result, index) =>
              `**${startIndex + index + 1}:** ${result?.id}\n**${
                result?.name
              }** ( ${result?.price} )\nبواسطة:<@!${
                result?.mod
              }>\nبتاريخ: ${result?.date}`
          )
          .join("\n\n");

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`vio_page_${i + 1}`)
            .setLabel(`الصفحة التالية`)
            .setStyle(ButtonStyle.Primary)
            .setDisabled(totalPages < 2 ? true : false),
          new ButtonBuilder()
            .setCustomId(`vio_page_${i - 1}`)
            .setLabel(`الصفحة السابقة`)
            .setDisabled(totalPages < 2 ? true : false)
            .setStyle(ButtonStyle.Secondary)
        );
        const embed = new EmbedBuilder()
          .setAuthor({
            name: member?.username,
            iconURL: member?.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp()
          .setTitle(`المخالفات - الصفحة ${i + 1}`)
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.White)
          .setDescription(`${pageContent}`)
          .setFooter({
            text: message.guild.name,
            iconURL: message.guild.iconURL({ dynamic: true }),
          });

        pages.push({ embed, components: row });
      }

      return pages;
    }
    const pages = createResultsPages(vio);
    let currentPage = 0;
    const currentEmbed = pages[currentPage].embed;
    const currentComponents = pages[currentPage].components;
    let msg = await message.reply({
      embeds: [currentEmbed],
      components: [currentComponents],
    });
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter: (interaction) =>
        interaction.customId.startsWith("vio_page_") &&
        interaction.user.id === member?.id,
      time: 60000,
    });
    collector.on("collect", async (interaction) => {
      const page = parseInt(interaction.customId.replace("vio_page_", ""));
      if (page >= 0 && page < pages.length) {
        currentPage = page;
        const newEmbed = pages[currentPage].embed;
        const newCopmonents = pages[currentPage].components;
        await interaction.deferUpdate();
        await msg.edit({
          embeds: [newEmbed],
          components: [newCopmonents],
        });
        1;
      }
    });

    collector.on("end", () => {
      msg.edit({ components: [] });
    });
  },
};
