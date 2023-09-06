require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { readdirSync } = require("node:fs");
const { QuickDB, MongoDriver } = require("quick.db");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const connectToDatabase = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const mongoDriver = new MongoDriver(process.env.MONGO_URI);
      await mongoDriver.connect();
      const db = new QuickDB({ driver: mongoDriver });
      resolve(db);
    } catch (error) {
      reject(error);
    }
  });
};

connectToDatabase()
  .then((db) => {
    client.db = db;
  })
  .catch((error) => {
    console.error("حدث خطأ أثناء الاتصال بقاعدة البيانات:", error);
  });
module.exports = client;
client.commands = new Collection();
client.aliases = new Collection();
client.config = require("./config.js");
readdirSync("./commands").forEach(async (dir) => {
  const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
    file.endsWith(".js")
  );

  commands.map((cmd) => {
    let file = require(`./commands/${dir}/${cmd}`);

    let name = file.name || "No command name.";
    let aliases = file.aliases || [];
    let option = name == "No command name." ? "❌" : "✅";

    if (name != "No command name.") {
      client.commands.set(name, file);
      if (aliases.length < 1) return;
      aliases.forEach((alias) => {
        client.aliases.set(alias, file);
      });
    } else {
      if (aliases.length < 1) return;
      aliases.forEach((alias) => {
        client.aliases.set(alias, file);
      });
    }

    console.log(`Loaded Command ${option} | ${name}`);
  });
});

readdirSync("./events").forEach(async (file) => {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
});

process.on("unhandledRejection", (e) => {
  console.log(e);
});
process.on("uncaughtException", (e) => {
  console.log(e);
});
process.on("uncaughtExceptionMonitor", (e) => {
  console.log(e);
});
client.login(process.env.TOKEN);
