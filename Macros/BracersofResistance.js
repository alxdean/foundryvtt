if (item.data.data.uses.value == 0)
{
    ui.notifications.notify("your last charge has been activated.")
    ChatMessage.create({content: "Rolling 1d20 to see what happens to the bracers" });
    let roll = new Roll('1d20').roll();
    if (roll.total == 1)
    {
        ChatMessage.create({content: "[[" + roll.total + "]] : You watch as the bracers dissolve into dust" });
    }
    else if (roll.total>=19)
    {
        let charges = new Roll('1d6').roll();
        let total = charges.total + 2
        item.update({'data.uses.value': total, 'data.uses.max': total})
        ChatMessage.create({content: "[[" + roll.total + "]] : The bracers regain [[" + charges.total + " + 2]] charges"  });

    }
    else
    {
        ChatMessage.create({content: "[[" + roll.total + "]] : The magic fades from the Bracers of Resistance" });
    }    
}