//Goodberry Item Macro
let target;
if(game.user.targets.size > 1) return ui.notifications.error(`Please target exactly 1 token.`);
if(game.user.targets.size == 1) 
	target = game.user.targets.values().next().value
else
	target = canvas.tokens.controlled[0]

let hp = Math.clamped(target.actor.data.data.attributes.hp.value + 1, 0, target.actor.data.data.attributes.hp.max);
target.actor.data.data.attributes.hp.value = hp;
    await ChatMessage.create({content: `${target.actor.name} gains 1 HP`, speaker:{alias: canvas.tokens.controlled[0].actor.name}, type: CONST.CHAT_MESSAGE_TYPES.OOC});
