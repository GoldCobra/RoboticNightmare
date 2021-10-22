require('dotenv').config()
const axios= require('axios')

const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.on('guildMemberAdd', (member)=>{
	const rulesChannel = "894852972117372988";
	member.guild.channels.cache.get("892043307738341386").send(`Welcome to the server <@${member.id}>. Be sure to checkout the rules ${member.guild.channels.cache.get(rulesChannel).toString()}`);
})

var fs = require('fs');

let sql = require('mssql');

let config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: 'yew.arvixe.com',
  database: 'MarioStrikers',
  options: {
      encrypt: true,
      trustServerCertificate: true,
      port: 443,
      cryptoCredentialsDetails: {
            minVersion: 'TLSv1'
        }
  }
}

client.on("messageCreate", messageManager);

async function messageManager(msg){
	if (msg.author.bot) return

	if(msg.channel.id){
		var token = msg.content.split(" ");
		if(token[0] == "!roboedit"){
			fs.readFile('msg_send.txt', 'utf8', function(err, data) {
				if (err) throw err;

       msg.channel.messages.fetch( 
         //in around put the ID of the message which you want to edit//
         {around:"895755842169761833" , limit: 1})
        .then(msg => {
          const fetchedMsg = msg.first();
          fetchedMsg.edit(data);
        });
			});	
		}

		if(token[0] == "!robosend"){
			fs.readFile('msg_send.txt', 'utf8', function(err, data) {
				if (err) throw err;
        client.channels.cache.get('892043307738341386').send(data);
			});
		}

    		if(token[0] == "!sandbox"){
			fs.readFile('msg_sandbox.txt', 'utf8', function(err, data) {
				if (err) throw err;
        client.channels.cache.get('897757084299431936').send(data);
			});
		}

    if(token[0] == "!mscrules"){
			if(msg.bot) return;
			
      msg.channel.send("https://bit.ly/3BBSwK5");
		}

    if(token[0] == "!smsrules"){
			if(msg.bot) return;
			
      msg.channel.send("https://bit.ly/3mLDBHf");
		}

    if(token[0] == "!mscbracket"){
			if(msg.bot) return;
			
      msg.channel.send("https://cdn.discordapp.com/attachments/816320433850155018/900850884668440657/unknown.png");
		}

    if(token[0] == "!smsbracket"){
			if(msg.bot) return;
			
      msg.channel.send("https://cdn.discordapp.com/attachments/816320433850155018/900106862177976440/unknown.png");
		}

    if(token[0] == "!tlmsc"){
			if(msg.bot) return;
			
      msg.channel.send("https://media.discordapp.net/attachments/806813942218883073/869189371847381022/unknown.png");
      msg.channel.send("https://cdn.discordapp.com/attachments/816320433850155018/900915579270103103/unknown.png");
		}
    
    if(token[0] == "!soon"){
			if(msg.bot) return;
			
      msg.channel.send("Soon ™");
		}

		if(token[0] == "!mscrating"){
			try {
        sql.connect(config, function(err) {
          var request = new sql.Request();

          let query = "exec GetRatingsForDiscordMSC";
          request.query(query, function(err, recordset) {
            if (err) {
              console.log(err);
              msg.react('❌');
            }
            else {
              let data = recordset.recordset;
				      const newData = [];
              for (let i = 0; i < recordset.recordset.length; i++) {
                newData.push(recordset.recordset[i].line);
                console.log(recordset.recordset[i].line);
              }
              
				      msg.channel.send(newData.join('\n'));
            }
          })
        })
      }
      catch (error) {
        console.log(error);
        msg.react('❌');
      }
		}

		if(token[0] == "!smsrating"){
			try {
        sql.connect(config, function(err) {
          var request = new sql.Request();

          let query = "exec GetRatingsForDiscordSMS";
          request.query(query, function(err, recordset) {
            if (err) {
              console.log(err);
              msg.react('❌');
            }
            else {
              let data = recordset.recordset;
				      const newData = [];
              for (let i = 0; i < recordset.recordset.length; i++) {
                newData.push(recordset.recordset[i].line);
                console.log(recordset.recordset[i].line);
              }
              
				      msg.channel.send(newData.join('\n'));
            }
          })
        })
      }
      catch (error) {
        console.log(error);
        msg.react('❌');
      }
		}

    if(token[0] == "!mslmsc"){
			const url3 = "https://docs.google.com/spreadsheets/d/1Cf5YggxcwNVMCTyQ1Xz7wC7OaOxVoC1rQIeEJSXo6s8/gviz/tq?";
			
			if(msg.bot) return;
      msg.channel.send("**MSL Season 1** — MSC Rankings");
			axios.get(url3)
			.then(function (response) {
				const data = JSON.parse(response.data.substr(47).slice(0,-2));
				const newData3 = [];

				data.table.rows.map((main)=>{
					newData3.push(main.c[0].v);
				})
				msg.channel.send(newData3.join('\n'));
				// I need this data here ^^
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
		}
    
    if(token[0] == "!mslsms"){
			const url4 = "https://docs.google.com/spreadsheets/d/1elh4wTVHNR0dv-QNklaNLMUNU07VKuaFkZkU9G2XWQ0/gviz/tq?";
			
			if(msg.bot) return;
      msg.channel.send("**MSL Season 1** — SMS Rankings");
			axios.get(url4)
			.then(function (response) {
				const data = JSON.parse(response.data.substr(47).slice(0,-2));
				const newData4 = [];

				data.table.rows.map((main)=>{
					newData4.push(main.c[0].v);
				})
				msg.channel.send(newData4.join('\n'));
				// I need this data here ^^
				return response.data;
			})
			.catch(function (error) {
				console.log(error);
			});
		}
    
    if(token[0] == "!mscreport") {
      if(msg.bot) return;
      try {
        let score = "";

        // get the score and the discord ids if available
        let p1 = client.users.cache.get(token[1].replace("<", "").replace(">", "").replace("@", "").replace("!", ""));
        score = token[2];
        let p2 = client.users.cache.get(token[3].replace("<", "").replace(">", "").replace("@", "").replace("!", ""));

        // set the paramters - if the token isn't a discord tag, just get the text, otherwise get the id and username
        if (p1 == undefined)
          p1 = token[1];
        else
          p1 = token[1] + p1.username;

        if (p2 == undefined)
          p2 = token[3];
        else
          p2 = token[3] + p2.username;

        console.log(p1);
        console.log(p2);
        console.log(token.length);

        sql.connect(config, function(err) {
          // create the request object
          var request = new sql.Request();

          let query = "";
          
          if (token.length == 4)
            query = "exec reportScoreMSC '" + p1 + "', '" + p2 + "', '" + score + "';"
          else if (token.length == 5) {
            query = "exec reportScoreMSC '" + p1 + "', '" + p2 + "', '" + score + "', '" + token[4] + "';"
          }
          else if (token.length == 6) {
            query = "exec ReportScoreWithTourneyDetailsMSC '" + p1 + "', '" + p2 + "', '" + score + "', '" + token[4] + "', '" + token[5] + "', '';"
          }
          else if (token.length == 7) {
            query = "exec ReportScoreWithTourneyDetailsMSC '" + p1 + "', '" + p2 + "', '" + score + "', '" + token[4] + "', '" + token[5] + "', '" + token[6] + "';"
          }

          console.log(query);

          request.query(query, function(err, recordset) {
              if (err) console.log(err) })
        })

        // todo: broken, need to fix - also, add X or something if it fails
        msg.react('☑️');
      }
      catch(error) {
        console.log(error);
        msg.react('❌');
      }
    }

    if(token[0] == "!smsreport") {
      if(msg.bot) return;
      try {
        let score = "";

        // get the score and the discord ids if available
        let p1 = client.users.cache.get(token[1].replace("<", "").replace(">", "").replace("@", "").replace("!", ""));
        score = token[2];
        let p2 = client.users.cache.get(token[3].replace("<", "").replace(">", "").replace("@", "").replace("!", ""));

        // set the paramters - if the token isn't a discord tag, just get the text, otherwise get the id and username
        if (p1 == undefined)
          p1 = token[1];
        else
          p1 = token[1] + p1.username;

        if (p2 == undefined)
          p2 = token[3];
        else
          p2 = token[3] + p2.username;

        console.log(p1);
        console.log(p2);
        console.log(token.length);

        sql.connect(config, function(err) {
          // create the request object
          var request = new sql.Request();

          let query = "";
          
          if (token.length == 4)
            query = "exec reportScoreSMS '" + p1 + "', '" + p2 + "', '" + score + "';"
          else if (token.length == 5) {
            query = "exec reportScoreSMS '" + p1 + "', '" + p2 + "', '" + score + "', '" + token[4] + "';"
          }
          else if (token.length == 6) {
            query = "exec ReportScoreWithTourneyDetailsSMS '" + p1 + "', '" + p2 + "', '" + score + "', '" + token[4] + "', '" + token[5] + "', '';"
          }
          else if (token.length == 7) {
            query = "exec ReportScoreWithTourneyDetailsSMS '" + p1 + "', '" + p2 + "', '" + score + "', '" + token[4] + "', '" + token[5] + "', '" + token[6] + "';"
          }

          console.log(query);

          request.query(query, function(err, recordset) {
              if (err) console.log(err) })
        })

        msg.react('☑️');
      }
      catch(error) {
        console.log(error);
        msg.react('❌');
      }
    }
	}
}

//REACTION ROLES
client.on('messageReactionAdd', async (reaction, user) => {
  console.log("new Reaction add");
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		try { 
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	const member = reaction.message.guild.members.cache.get(user.id);

	if(reaction.message.id == "896450856298381312"){
		const role1 = "862237914863239198";
		const role2 = "680810288605298744";
		if(reaction.emoji.name == '✅'){
			member.roles.add(role1);
		}
		if(reaction.emoji.id == '712278814163730452'){
			member.roles.add(role2);
		}
	}

	if(reaction.message.id == "896450908928507965"){
		const role3= "862237991635124244";
		const role4 = "781487757176209428";
		if(reaction.emoji.name== '✅'){
			member.roles.add(role3);
		}
		if(reaction.emoji.id == '781493087342952479'){
			member.roles.add(role4);
		}
	}

	if(reaction.message.id == "896450949474816100"){
		const role5 = "862238161395908628";
		if(reaction.emoji.name == '🏆'){
			member.roles.add(role5);
		}		
	}

	if(reaction.message.id == "896450993531801672"){
		const role6 = "862238264752996372";
		if(reaction.emoji.name == '🧩'){
			member.roles.add(role6);
		}
	}
});

client.on("messageReactionRemove", (reaction, user)=> {
	const member = reaction.message.guild.members.cache.get(user.id);
  if(reaction.message.id == "896450856298381312"){
		if(reaction.emoji.name == '✅'){
			member.roles.remove("862237914863239198");
		}
		if(reaction.emoji.id == '712278814163730452'){
      console.log("mscball reaction removed")
			member.roles.remove("680810288605298744");
		}
	}

	if(reaction.message.id == "896450908928507965"){
		if(reaction.emoji.name == '✅'){
			member.roles.remove("862237991635124244");
		}
		if(reaction.emoji.id == '781493087342952479'){
      console.log('sms ball reaction removed')
			member.roles.remove("781487757176209428");
		}
	}

	if(reaction.message.id == "896450949474816100"){
		if(reaction.emoji.name == '🏆'){
			member.roles.remove("862238161395908628");
		}
	}

  if(reaction.message.id == "896450993531801672"){
		if(reaction.emoji.name == '🧩'){
			member.roles.remove("862238264752996372");
		}
	}
})

client.login(process.env.BOT_TOKEN)