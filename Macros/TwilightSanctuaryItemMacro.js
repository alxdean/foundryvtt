// only works with midi qol and speed roll ability checks
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
        token.setFlag('token-auras', 'aura1.distance', 30);
        token.setFlag('token-auras', 'aura1.colour', '#e1dd56');
        token.setFlag('token-auras', 'aura1.opacity', 0.2);        

        let toggleItem = tactor.items.find(i => i.data.flags?.DnDean?.SanctuaryToggle === tactor.id)
        if (toggleItem === undefined) 
        {
            await tactor.createOwnedItem({
                "name": "Toggle Sanctuary Mode",
                "type": "feat",
                "img": "systems/dnd5e/icons/spells/heal-royal-3.jpg",
                "data": {
                  "activation": {
                    "type": "special",
                    "cost": 1,
                    "condition": ""
                  }
                },
                "flags": {
                  "itemacro": {
                    "macro": {
                      "data": {
                        "_id": null,
                        "name": "Toggle SanctuaryMode",
                        "type": "script",                    
                        "img": "systems/dnd5e/icons/spells/heal-royal-3.jpg",
                        "scope": "global",
                        "command": "if(game.user.targets.size > 1) return ui.notifications.error(`Please target exactly 1 token.`);  \n    let tactor;\n    tactor = game.actors.get(game.user.targets.values().next().value.data.actorId);    \n    let flag = DAE.getFlag(tactor, 'sanctuarymode')\n    if (flag!= undefined)\n    {\n        DAE.unsetFlag(tactor, 'sanctuarymode');\n        ChatMessage.create({content: tactor.data.name + \" will receive Temp HP at the end of their turn\" });\n    }\n    else\n    {\n        ChatMessage.create({content: tactor.data.name + \" will stop being charmed or frightened at the end of their turn\" });\n        DAE.setFlag(tactor, 'sanctuarymode','condition')\n    }",
                        "folder": null,
                        "sort": 0,
                        "permission": {
                          "default": 0
                        },
                        "flags": {}
                      }
                    }
                  },
                  "midi-qol": {
                    "onUseMacroName": "ItemMacro"
                  },
                  "DnDean": {
                    "SanctuaryToggle":
                        tactor.id
                  }              
                }
              })  
        }
      
    }
    
    //TODO: check if the current target is the caster. if so, activate the aura token effect. makes it easier to see the radius for the other players.
}

if (args[0] === "each") {
    //this activates on each person in radius on the end of their turn.

    let flag = DAE.getFlag(tactor, 'sanctuarymode')

    if (flag != undefined && flag === "condition") //remove either frightened or charmed condition
    {
        ChatMessage.create({content: "<h3>Twilight Sanctuary</h3><br>" + tactor.data.name + " is no longer charmed or frightened" });        

        DAE.unsetFlag(tactor, 'sanctuarymode');
    }
    else // Add Temp HP
    {
        let roll = new Roll('1d6').roll();
        let newTempHP = classMod + roll.total ;

        if (tactor.data.data.attributes.hp.temp < newTempHP)
        {
            ChatMessage.create({content: "<h3>Twilight Sanctuary</h3><br>New temporary HP for " + tactor.data.name + " is [[" + roll.total + " + " + classMod + "]]. Previous temporary HP was " + tactor.data.data.attributes.hp.temp + "."});        
            tactor.update({'data.attributes.hp.temp' : newTempHP});
        }
        else
        {
            ChatMessage.create({content: "<h3>Twilight Sanctuary</h3><br>New temporary HP for " + tactor.data.name + " is [[" + roll.total + " + " + classMod + "]]. Existing temporary HP was " + tactor.data.data.attributes.hp.temp + ". Temporary HP remains unchanged."})
        }
    }
}

if (args[0] === "off") {
    //this activates on each person where the effect was active and either expired, or the effect on the caster is deleted.     
    ChatMessage.create({ content: "<h3>Twilight Sanctuary</h3><br>Twilight Sanctuary effect has ended for " + tactor.data.name });
    if (args[2] === lastArg.tokenId) //only if the caster is currently active
    {
        let removeItem = tactor.items.find(i => i.data.flags?.DnDean?.SanctuaryToggle === tactor.id)
        if(removeItem) await tactor.deleteOwnedItem(removeItem.id);
      
        token = canvas.tokens.get(lastArg.tokenId);
        token.setFlag('token-auras', 'aura1.distance', 0);
    }
    
}