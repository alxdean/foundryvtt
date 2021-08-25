let macroActor = game.actors.get("yBVWqqjnBIEkLj4z")
//let macroActor = canvas.tokens.controlled[0].actor
let wisMod = macroActor.data.data.abilities.wis.mod;
let classLvl = macroActor.data.data.details.level;
let target;
if(game.user.targets.size > 1) return ui.notifications.error(`Please target exactly 1 token.`);
if(game.user.targets.size == 1) 
	target = game.user.targets.values().next().value.actor
else
	target = canvas.tokens.controlled[0].actor

	
	let wisMod = args[1]
		let target = args[3].actor;
		if (target == undefined) //not actively targeting a user
		return;

		let roll = new Roll('1d8').roll();
		let newTempHP = wisMod + roll.total ;
	
		if (target.data.data.attributes.hp.temp < newTempHP)
		{
		ChatMessage.create({content: "new Temp HP for " + target.data.name + " is " + newTempHP });
		target.update({
			'data.attributes.hp.temp' : newTempHP
		});
		}
		else
		{
		ChatMessage.create({content: "Existing Temp HP was higher. no Temp HP awarded"});
		}

