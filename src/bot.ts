import { Client } from 'discord.js';
import { actionLogChannel, mainServer, prefix, parentChannel } from './configs';

export class Mail extends Client {
  actionLogChannel: string;
  openedTickets: Map<string, any>;
  parentChannel: string;
  mainServer: string;
  prefix: string;
  
  constructor(options: Object) {
    super(options);

    this.on('ready', (): void => {
      console.log('Bot ready as');
      console.log(this.user.tag);
      console.log('vv Status vv');
      console.log('Guilds: ');
      console.log(this.guilds.cache.size);
      console.log('Users: ');
      console.log(this.users.cache.size);
      console.log('-------------------------');
    });
    
    this.openedTickets = new Map();
    this.prefix = prefix;
    this.parentChannel = parentChannel
    this.actionLogChannel = actionLogChannel;    
    this.mainServer = mainServer;
  }

  getMainServer() {
    return this.guilds.cache.get(this.mainServer);
  }

  getUser(userid: string) {
    return this.users.cache.get(userid);
  }

  public async run(token: string): Promise<void> {
    super.login(token);
  }
}
