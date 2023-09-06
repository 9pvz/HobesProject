const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
  name: "رصيد",
  description: "معرفة رصيدك",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: ["حسابي", "حساب", "رصيدي"],
  noPausedUse: true,
  run: async (client, message, args) => {
    let member =
      message.mentions.members.first() ||
      (await message.guild.members.cache.get(args[0])) ||
      message.author;
    let cash = (await client.db.get(`cash_${member?.id}`)) || 0;
    let bank = await client.db.get(`bank_${member?.id}`);
    if (bank?.status == false || !bank)
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.White)
            .setDescription(
              `**__ عـزيـزي الـعـمـيـل الـرجـاء الـتـوجـه الـى <#1121891547139547316> لـفـتـح حـسـاب بـنـكـي__**`
            ),
        ],
      });
    await message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp()
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.White)
.setDescription(`**__ <:emoji_215:1122294388702314596> – أهـلآ بـك فـي مـصـرف الـراجـحـي .

<:pp721:1122478518203334657> - عـزيـزي المـواطـن رصـيـدك الـحـالـي .


<:pp783:1122498483560132668>  - الــكــاش : ( ${cash} ) .


<:pp889:1122497943778361465> - الـبـنـك : ( ${bank?.balance} ) .


<:pp943:1122294693611458630> - إجـمـالـي الـرصـيـد : ( ${cash + bank?.balance} ) .

<:emoji_241:1122295270978375690> - وزارة المـالـيـة .__**`
          )
          .setFooter({
            text: message.guild.name,
            iconURL: message.guild.iconURL({ dynamic: true }),
          }),
      ],
    });
  },
};
