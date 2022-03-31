//DAE Macro Execute, Effect Value = "Macro Name" @target 
if (!game.modules.get("advanced-macros")?.active) ui.notifications.error("Please enable the Advanced Macros module")

const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const target = canvas.tokens.get(lastArg.tokenId) || token;



    let range = canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [{
        t: "circle",
        user: game.user._id,
        x: target.x + canvas.grid.size / 2,
        y: target.y + canvas.grid.size / 2,
        direction: 0,
        distance: 30,
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
            await spawnActor(canvas.scene,template,"Owl Familiar");     
            //await target.document.update({ x: template.data.x, y: template.data.y } , {animate : false})
            if (removeTemplates) await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", templateArray)
            //await tactor.deleteEmbeddedDocuments("ActiveEffect", [lastArg.effectId]); 
        };
    });
    
    function spawnActor(scene, template,spawnName) {
	
        let protoToken = duplicate(game.actors.getName(spawnName).data.token);
        protoToken.x = template.data.x;
        protoToken.name = spawnName;
        protoToken.y = template.data.y;
        protoToken.flags.summoner = token.data._id;
        // Increase this offset for larger summons
        protoToken.x -= (scene.data.grid/2+(protoToken.width-1)*scene.data.grid);
        protoToken.y -= (scene.data.grid/2+(protoToken.height-1)*scene.data.grid);		 
        return canvas.scene.createEmbeddedDocuments("Token",[protoToken]);
    }
    
    //let spawnName = "Owl Familiar";
    //spawn = await spawnActor(canvas.scene,canvas.templates.placeables.map(x=>x).reverse().find(t => t.data.user == game.user.id)?.data || canvas.tokens.get(token.data._id),spawnName);
    // use this to acticate debugging in the brwoser. useful to see what's currently happening with the code. Needs Developer Console to be on. i.e. F12
    //debugger 
    
    /** intended for use with Item Macro. 'item' here is the spell being cast if using outside Item Macro */
    /** spawns an actor with the same name as the spell at the location of the template */