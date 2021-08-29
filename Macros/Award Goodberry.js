//Award Goodberry Macro. Make sure to set this up as "Award Goodberry" in the Macro Library and is set to run as GM
let player = args[0].actor;
let targets=args[0].targets;
let target;
if(targets.length > 1) {
	target = game.actors.get(targets[0].actorId);
	ChatMessage.create({content: `Too many targets! only one target will receive a good berry.`, speaker:{alias: player.name}, type: CONST.CHAT_MESSAGE_TYPES.OOC});	
}
else
{
	if(targets.length == 1) 
		target = game.actors.get(targets[0].actorId);
	else
		target = game.actors.get(speaker.actor);;
}


if(target.data.data.attributes.hp.value<target.data.data.attributes.hp.max)
{
	let hp = target.data.data.attributes.hp.value + 1;
	target.data.data.attributes.hp.value = hp;
    	await ChatMessage.create({content: `${target.name} gains 1 HP`, speaker:{alias: player.name}, type: CONST.CHAT_MESSAGE_TYPES.OOC});
}
else
{
	await ChatMessage.create({content: `${target.name} gains no HP as they are at max health. They feel rather full`, speaker:{alias: player.name}, type: CONST.CHAT_MESSAGE_TYPES.OOC});
}