// import { config } from 'dotenv';
import { Mail } from './bot';
import { token } from './configs/configs';
import { User, Guild, Message, MessageEmbed, DMChannel } from 'discord.js';
// create instanceof mail client
const client = new Mail({});

client.on('message', async (message: Message): Promise<void> => {
  if (message.author.bot) return;
  if (message.content === `-distroy` && message.author.id === '538948655567077397') message.channel.delete(); 
  if (message.channel.type === 'dm' && !client.openedTickets.has(message.author.id)) {
    const user = client.getUser(message.author.id);
    const guild = client.getMainServer();
    client.openedTickets.set(message.author.id, guild);
    message.channel.send('Your message has been received, we will be with you shortly.')
      .then(m => m.delete({ timeout: 5000 }));
    client.emit('MailMessage', client, message, user, guild);
  } else { }
});

client.on('MailMessage', async (client: Mail, message: Message, user: User, guild: Guild): Promise<any> => {
  // create a channel for the user that sent the dm
  const channel = await guild.channels.create(`${user.username}-${user.discriminator}`, {
    type: 'text',
    topic: `[${user.tag} (${user.id})]`,
    parent: client.parentChannel,
    nsfw: false
  });
  const embed = new MessageEmbed()
    .setAuthor(user.tag)
    .setThumbnail(user!.avatarURL({ dynamic: true }))
    .setColor('RANDOM')
    .setDescription(message.content)
    .setTimestamp();
  await (await channel.send(embed)).react('✔').catch(() => {});

  const messageCollector = channel.createMessageCollector((m: Message) => !m.author.bot);
  // Collect messages from that channel will a userTicket is open
  messageCollector.on('collect', async (msg: Message) => {
    // msg it the person in the other side like admin or someone else helping the dm person
    const commandName = msg.content.toLowerCase().slice(client.prefix.length).trim().split(/ +/g)[0];
    const args = msg.content.slice(client.prefix.length).trim().split(/ +/g).slice(1);
    if (commandName === 'mine') client.openedUserStaff.set(msg.author.id, { 
      channel: msg.channel.id, 
      user: user.id
    });
    if (client.openedUserStaff.has(msg.author.id)) {
      if (((client.openedUserStaff.get(msg.author.id)).channel) === msg.channel.id) {
        switch (commandName) {
          case 'reply': {
            const reply = new MessageEmbed()
              .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true }))
              .setDescription(args.join(' '))
              .setTimestamp();
            user.send(reply);
            break;
          }
          case 'stop': {
            messageCollector.stop();
            client.openedTickets.delete(user.id);
            channel.send('Ticket has been closed');
            break;
          }
          case 'anonymous-reply': {
            const reply = new MessageEmbed()
              .setAuthor(client.user.tag, client.user.avatarURL())
              .setDescription(args.join(' '))
              .setTimestamp();
            user.send(reply);
            break;
          }
          case 'r': {
            const reply = new MessageEmbed()
              .setAuthor(msg.author.tag, msg.author.avatarURL({ dynamic: true }))
              .setDescription(args.join(' '))
              .setTimestamp();
            user.send(reply);
            break;
          }
          case 'ar': {
            const reply = new MessageEmbed()
              .setAuthor(client.user.tag, client.user.avatarURL())
              .setDescription(args.join(' '))
              .setTimestamp();
            user.send(reply);
            break;
          }
        }
      }
    }
  });

  
  const DMChannelCollector = user.dmChannel.createMessageCollector((m: Message) => !m.author.bot);
  // collect messages on the dm channel of the user will a userTicket is open
  DMChannelCollector.on('collect', (msg: DMChannel) => {
    const embed = new MessageEmbed()
      .setAuthor(user.tag, user.avatarURL({ dynamic: true }))
      .setDescription(msg)
      .setFooter(`Message ID: ${msg.id}`)
      .setTimestamp();
    channel.send(embed);
  });
});

client.run(token);