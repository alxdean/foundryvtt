if (!game.modules.get("advanced-macros")?.active) {ui.notifications.error("Please enable the Advanced Macros module") ;return;}
let classMod = args[1]
const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);

    
if (tactor == undefined) //not actively targeting a user
return;

if (args[0] === "on") {
    //this activates on each person in radius when the aura effect is applied. 
    if (args[2] === lastArg.tokenId) //only if the caster is currently active
    {
        token = canvas.tokens.get(lastArg.tokenId);
        token.document.setFlag('token-auras', 'aura1.distance', 30);
        token.document.setFlag('token-auras', 'aura1.colour', '#e1dd56');
        token.document.setFlag('token-auras', 'aura1.opacity', 0.2);        
    }
}

if (args[0] === "off") {
    //this activates on each person where the effect was active and either expired, or the effect on the caster is deleted.     
    ChatMessage.create({ content: "<h3Pass without trace</h3><br>has ended for " + tactor.data.name });
    if (args[2] === lastArg.tokenId) //only if the caster is currently active
    {      
        token = canvas.tokens.get(lastArg.tokenId);
        token.document.setFlag('token-auras', 'aura1.distance', 0);
    }
    
}
