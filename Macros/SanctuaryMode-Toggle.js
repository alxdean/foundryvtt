if(game.user.targets.size > 1) return ui.notifications.error(`Please target exactly 1 token.`);  
    let tactor;
    tactor = game.actors.get(game.user.targets.values().next().value.data.actorId);    
    let flag = DAE.getFlag(tactor, 'sanctuarymode')
    if (flag!= undefined)
    {
        DAE.unsetFlag(tactor, 'sanctuarymode');
        ChatMessage.create({content: tactor.data.name + " will receive Temp HP at the end of their turn" });
    }
    else
    {
        ChatMessage.create({content: tactor.data.name + " will stop being charmed or frightened at the end of their turn" });
        DAE.setFlag(tactor, 'sanctuarymode','condition')
    }
    