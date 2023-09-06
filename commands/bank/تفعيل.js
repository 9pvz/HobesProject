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
  name: "تفعيل",
  description: "تفعيل الحساب لبنكي لشخصًا ما",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: [],
  onlyCustomRole: true,
  run: async (client, message, args) => {
    let member = message.mentions.users.first()?.id || args[0];
    let user = await client.users.cache.get(member);
        if (!message.member.roles.cache.has(client.config.roles.امر_تفعيل)) return;
    if (!user)
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
            .setColor(Colors.DarkRed)
            .setDescription(`**__. <:m7:1122301620349309009> – عـزيـزي الإداري .

<:IMG_6116:1136505822948626432> -  الـرجـاء مـنـك تـحـديـد الـعـضـو.

( وشـكـرآ لـك )__**`),
        ],
      });

    let data = await client.db.get(`bank_${user?.id}`);
    if (data && data.status === true)
      return await message.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
            .setColor(Colors.DarkRed)
            .setDescription(`**تـم تـفـعـيـل الـحـسـاب لـهـذا الـعـضـو مسـبـقـا**`),
        ],
      });

    await client.db.set(`bank_${user?.id}`, { balance: 5000, status: true });
    await user?.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.White)
          .setDescription(
 `**__ <:emoji_215:1123253768377597952> - أهـلآ بـك فـي مـصـرف الـراجـحـي .

 <:pp721:1122478518203334657> - عـزيـزنـا الـعـضـو .

 <a:emoji_8:1122560519967092786> - تـم تـفـعـيـل حـسـابـك الـمـصـرفـي بـنـجـاح .

<:pp943:1122294693611458630> -  تـم إضـافـة : 5000 ريـال إلـى حـسـابـك الـمـصـرفـي .__**`
          ),
      ],
    });
    return await message.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.White)
          .setDescription(`**__<:emoji_215:1123253768377597952> - أهـلآ بـك فـي مـصـرف الـراجـحـي . 

<:m7:1122301620349309009> - عـزيـزنـا مـوظـف الـجـهـة : ${message.author} .

<:pp721:1122478518203334657> - تـم تـفـعـيـل الـحـسـاب الـمـصـرفـي لـلـمـواطـن .

<:emoji_241:1122295270978375690> -  الـوزارة الـمالية .__**`
          ),
      ],
    });
  },
};
