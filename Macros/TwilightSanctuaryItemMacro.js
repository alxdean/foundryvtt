// only works with midi qol and speed roll ability checks
if (!game.modules.get("advanced-macros")?.active) {ui.notifications.error("Please enable the Advanced Macros module") ;return;}
let wisMod = args[1]
const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);

    
if (tactor == undefined) //not actively targeting a user
return;


if (args[0] === "each") {


    let flag = DAE.getFlag(tactor, 'sanctuarymode')

    if (flag != undefined && flag === "condition") //remove either frightened or charmed condition
    {
        ChatMessage.create({content: tactor.data.name + " is no longer charmed or frightened" });        

        DAE.unsetFlag(tactor, 'sanctuarymode');
    }
    else // Add Temp HP
    {
        let roll = new Roll('1d6').roll();
        let newTempHP = wisMod + roll.total ;

        if (tactor.data.data.attributes.hp.temp < newTempHP)
        {
        ChatMessage.create({content: "new Temp HP for " + tactor.data.name + " is " + newTempHP });
        tactor.update({
            'data.attributes.hp.temp' : newTempHP
        });
        }
        else
        {
        ChatMessage.create({content: "Existing Temp HP was higher for " + tactor.data.name + ". no Temp HP awarded"});
        }
    }
}

if (args[0] === "off") {
    DAE.unsetFlag(tactor, 'sanctuarymode');
    ChatMessage.create({ content: "Twilight Sanctuary has expired" });
}