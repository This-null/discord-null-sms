const { Client, GatewayIntentBits } = require('discord.js');
const { vonage } = require('@vonage/server-sdk');
const config = require('./ekmek.json');

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages
]
 });

client.on('ready', () => {
  console.log(`Hello World.`);
  client.user.setStatus("idle");
  client.user.setActivity(`null 💛 SMS`);
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
 if (newMember.guild.id !== config.guildId) return;

 const hasSmsRole = newMember.roles.cache.has(config.smsRoleId);
 const hadSmsRole = oldMember.roles.cache.has(config.smsRoleId);

 if (!hasSmsRole && hadSmsRole) {
   const phoneNumber = await newMember.fetch('phoneNumber');

   if (phoneNumber) {
     vonage.initialize(config.vonage);
     vonage.sendSms(phoneNumber, 'SMS Guard Rolü Kaldırıldı!');
   }
 }
});


process.on('unhandledRejection', async (err, cause) => {
  console.log(`[Uncaught Rejection]: ${err}`.bold.red);
  console.log(cause);
});

process.on('uncaughtException', async err => {
  console.log(`[Uncaught Exception] ${err}`.bold.red);
});

client.login(config.token);