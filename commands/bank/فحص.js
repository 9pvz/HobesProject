const { EmbedBuilder, Colors } = require("discord.js");

module.exports = {
  name: "رحلة",
  description: "رحلة عضو",
  userPerms: [],
  category: "bank",
  botPerms: [],
  aliases: [],
  run: async (client, message, args) => {
    if (!message.member.roles.cache.has(client.config.roles.امر_فحص)) return;
    let sa = message.mentions.users.first()?.id || args[0];
    let user = await client.users.cache.get(sa);
    let bank = await client.db.get(`bank_${user?.id}`);
    if (!user)
      return await message.reply({
        content: `**__ <:IMG_6116:1136505822948626432>- عـزيـزي الإداري يـرجـى الـتـأكـد مـن الـفـحـص بـالـشـكـل الـصـحـيـح .

– وشـكـرآ لـك -__**`,
        /*embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: message.author.username,
              iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .setThumbnail(client.config.imageBank || null)
            .setColor(Colors.DarkRed)
            .setDescription(`**__ <:IMG_6116:1136505822948626432>- عـزيـزي الإداري يـرجـى الـتـأكـد مـن الـفـحـص بـالـشـكـل الـصـحـيـح .

– وشـكـرآ لـك -__**`),
        ],*/
      });
    if (bank?.status == false || !bank)
      return await message.reply({
        content: `**__ الـعـضـو لا يـمـلـك حـسـاب بـنـكـي .

– وشـكـرآ لـك -__**`,
        /*embeds: [
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
        ],*/
      });
    await client.db.add(`segel_${user?.id}.vists`, 1);
    await client.db.sub(`bank_${user?.id}.balance`, Number(400));
    await user.send({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.Green)
          .setDescription(
            `**__ <:emoji_215:1122296114360627270> - مـصـرف الـراجـحـي .

<:pp721:1122478518203334657> - عـزيـزي الـعـضـو .

<a:emoji_8:1122560519967092786> – تـم خـصـم ( 400 ) رسـوم ركـوب الـطـائـرة فـي مـطـار الـمـديـنـه الـكـبـيـره مـع تـمـنـيـاتـنـا لـك بـرحـلـة ممـتـعـة <:IMG_6116:1136505822948626432> .

<:emoji_241:1122295270978375690> - وزارة المـالـيـة .__**`
          ),
      ],
    });
    return await message.reply({
      content: `**__ <:IMG_6116:1136505822948626432>  - تـم خـصـم رسـوم الـتـذكـرة 

- وشـكـراً لـك -
__**`,
      /*embeds: [
        new EmbedBuilder()
          .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setThumbnail(client.config.imageBank || null)
          .setColor(client.config.color || Colors.Green)
          .setDescription(
            `**__ <:IMG_6116:1136505822948626432>  - تـم خـصـم رسـوم الـتـذكـرة 

- وشـكـراً لـك -
__**`
          ),
      ],*/
    });
  },
};
