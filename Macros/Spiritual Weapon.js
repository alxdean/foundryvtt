//DAE Macro Execute, Effect Value = "Macro Name" @target 
if (!game.modules.get("advanced-macros")?.active) ui.notifications.error("Please enable the Advanced Macros module")

const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const target = canvas.tokens.get(lastArg.tokenId) || token;
debugger
let mod = tactor.data.data.abilities[args[2]].mod

let data = {}
//debugger
/**
 * Create Spiritual Weapon item in inventory
 */
if (args[0] === "on") {
    let range = canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [{
        t: "circle",
        user: game.user._id,
        x: target.x + canvas.grid.size / 2,
        y: target.y + canvas.grid.size / 2,
        direction: 0,
        distance: 60,
        borderColor: "#FF0000",
        flags: {
            DAESRD: {
                Summoner: {
                    ActorId: tactor.id
                }
            }
        }
        //fillColor: "#FF3366",
    }]);

    range.then(result => {
        let templateData = {
            t: "rect",
            user: game.user._id,
            distance: 7.5,
            direction: 45,
            x: 0,
            y: 0,
            fillColor: game.user.color,
            flags: {
                DAESRD: {
                    Summoner: {
                        ActorId: tactor.id
                    }
                }
            }
        };



        Hooks.once("createMeasuredTemplate", deleteTemplatesAndSpawn);
        let doc = new CONFIG.MeasuredTemplate.documentClass(templateData, { parent: canvas.scene })
        let template = new game.dnd5e.canvas.AbilityTemplate(doc);
        template.actorSheet = tactor.sheet;
        template.drawPreview();

        async function deleteTemplatesAndSpawn(template) {
            //debugger
            let removeTemplates = canvas.templates.placeables.filter(i => i.data.flags.DAESRD?.Summoner?.ActorId === tactor.id);
            let templateArray = removeTemplates.map(function (w) {
                return w.id
            })  
            //debugger
            let damage = Math.floor(Math.floor(args[1] / 2));            
            var weapons = await spawnActor(canvas.scene,template,"Spiritual Weapon");     
            if (removeTemplates) await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", templateArray)

            //debugger

            let weapon = weapons[0].actor            
            let strike = weapon.items.find(item => item.data.name == "Warhammer");
            if (strike == null || strike == undefined)
            {
              ui.notification.error("Weapon not found");
              return;
            }
            await strike.update({
              "data.damage.parts": [
                [
                `${damage}d8+${mod}`,
                `force`
                ]
              ]}															
            );
  
           

        };
    });
    
    function spawnActor(scene, template,spawnName) {
	
        let protoToken = duplicate(game.actors.getName(spawnName).data.token);
        protoToken.x = template.data.x;
        protoToken.name = spawnName;
        protoToken.y = template.data.y;
        protoToken.flags.SpiritualWeapon = tactor.id;        
        // Increase this offset for larger summons
        protoToken.x -= (scene.data.grid/2+(protoToken.width-1)*scene.data.grid);
        protoToken.y -= (scene.data.grid/2+(protoToken.height-1)*scene.data.grid);		 
        return canvas.scene.createEmbeddedDocuments("Token",[protoToken]);
    }
}
if (args[0] === "off") {
  
  let weapons = canvas.tokens.ownedTokens.filter(i => i.data.flags.SpiritualWeapon === tactor.id)
if (weapons.length>0)
  await canvas.scene.deleteEmbeddedDocuments("Token", [weapons[0].id])
}
  /* await tactor.createEmbeddedDocuments("Item", [
    {
      "name": "Summoned Spiritual Weapon",
      "type": "weapon",
      "data": {
        "equipped": true,
        "identified": true,
        "activation": {
          "type": "bonus",
        },
        "target": {
          "value": 1,
          "width": null,
          "type": "creature"
        },
        "range": {
          "value": 5,
          "units": "ft"
        },
        "ability": args[2],
        "actionType": "msak",
        "attackBonus": "0",
        "chatFlavor": "",
        "critical": null,
        "damage": {
          "parts": [
            [
              `${damage}d8+@mod`,
              "force"
            ]
          ],
        },
        "weaponType": "simpleM",
        "proficient": true
      },
      "flags": {
        "DAESRD": {
          "SpiritualWeapon":
            target.actor.id
        }
      },
      "img": `${image}`,
      "effects" : []
    },
  ]);
  ui.notifications.notify("Weapon created in your inventory")

} */
