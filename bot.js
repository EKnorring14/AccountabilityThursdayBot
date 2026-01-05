require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ]
});

// Load from environment variables
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  // Schedule task for every Thursday at 10pm EST (which is 2am UTC on Friday during standard time)
  // Cron format: minute hour day-of-month month day-of-week
  // This runs at 10pm EST (adjust for daylight saving time if needed)
  cron.schedule('0 22 * * 4', async () => {
    try {
      const channel = await client.channels.fetch(CHANNEL_ID);
      
      if (channel) {
        // Find the role by name
        const guild = channel.guild;
        const role = guild.roles.cache.find(r => r.name === 'Accountability Thursday');
        
        if (role) {
          await channel.send(`${role} Time for Accountability Thursday! 🎯`);
          console.log('Accountability Thursday ping sent!');
        } else {
          console.log('Role "Accountability Thursday" not found');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, {
    timezone: 'America/New_York' // EST/EDT timezone
  });
  
  console.log('Accountability Thursday bot is running!');
});

client.login(TOKEN);