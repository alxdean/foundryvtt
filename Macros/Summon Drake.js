function selectShape(drakeactorname){
	let typeDialogOptions = "";
		
	typeDialogOptions += `<option value="Acid">Acid</option>`;
	typeDialogOptions += `<option value="Cold">Cold</option>`;
	typeDialogOptions += `<option value="Fire">Fire</option>`;
	typeDialogOptions += `<option value="Lightning">Lightning</option>`;
	typeDialogOptions += `<option value="Poison">Poison</option>`;
    let dialogContent = `
                        <h2>Select your Type</h2>
                        <div style="flex:1">Type:<select name="drake">${typeDialogOptions}</select></div>
                        `;
new Dialog({
        title: "Drake Companion Type",
        content: dialogContent,
        buttons: {
            accept_button: {
                label: `<i class="fas fa-dragon"></i>Summon Drake!`,
                callback: async (html) => {                    
                    let draketype = html.find("[name=drake]")[0].value;
					let creature = game.actors.getName(drakeactorname);
					const effect_name = draketype + " Type";

let items = creature.getEmbeddedCollection("Item").contents;
let strikeid = items[1].id;
let damagetype = draketype.toLowerCase();
/*
let strike = creature.getEmbeddedDocument("Item",strikeid);
strike.data.data.damage.parts[0][1]="fire"
let result = await creature.updateEmbeddedDocuments("Item", [strike.data]);
*/

let result = await creature.updateEmbeddedDocuments("Item",[{
	"_id": strikeid , 

		"data": {
			"damage": {
		          "parts": [
		            [
		              `1d6`,
		              damagetype
            		    ]
	                  ]}
	          }
}]);


					const effect = creature.data.effects.contents;

					for (let i = 0; i < effect.length; i++){

						let condition = effect[i].data.label;
						let effect_id = effect[i].data._id;
						
						if (condition.includes("Type"))
						{
							if  (condition != effect_name)
								await creature.updateEmbeddedEntity("ActiveEffect", {"_id": effect_id, "disabled" : true});			
							else 
								await creature.updateEmbeddedEntity("ActiveEffect", {"_id": effect_id, "disabled" : false});			
						}				
					}					
					drake = await spawnActor(canvas.scene,canvas.templates.placeables.map(x=>x).reverse().find(t => t.data.user == game.user.id)?.data || canvas.tokens.get(token.data._id),draketype);
					
                }
            }
        },
        default: "accept_button"
    }).render(true);
}
let drakeactorname = "Drake Companion";
//debugger
debugger
selectShape(drakeactorname)
/** intended for use with Item Macro. 'item' here is the spell being cast if using outside Item Macro */
/** spawns an actor with the same name as the spell at the location of the template */
//(async ()=>{
    function spawnActor(scene, template,draketype) {
       
         let protoToken = duplicate(game.actors.getName(drakeactorname).data.token);
         protoToken.x = template.x;
		 protoToken.name = draketype + " Drake";
         protoToken.y = template.y;
         protoToken.flags.summoner = token.data._id;
         // Increase this offset for larger summons
         protoToken.x -= (scene.data.grid/2+(protoToken.width-1)*scene.data.grid);
         protoToken.y -= (scene.data.grid/2+(protoToken.height-1)*scene.data.grid);		 
         return canvas.scene.createEmbeddedDocuments("Token",[protoToken]);
     }
//})();