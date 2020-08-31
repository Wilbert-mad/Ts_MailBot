// import { config } from 'dotenv';
import { Mail } from './bot';
import { token } from './configs';
import { User, Guild, Message } from 'discord.js';
const client = new Mail({});

client.on('message', async (message) => {
  if (message.author.bot) return;
  if (message.content === `-distroy` && message.author.id === '538948655567077397') { message.channel.delete() }
  if (message.channel.type === 'dm' && !client.openedTickets.has(message.author.id)) {
    const user = client.getUser(message.author.id);
    const guild = client.getMainServer();
    client.openedTickets.set(message.author.id, guild);
    await message.channel.send('Your message has been received, we will be with you shortly.')
      .then(m => m.delete({ timeout: 10000 }));
    client.emit('MailMessage', client, message, user, guild);
  } else { }
});

client.on('MailMessage', async (client: Mail, message: Message, user: User, guild: Guild): Promise<any> => {
  
});

client.run(token);