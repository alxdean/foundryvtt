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
					let damagetype = draketype.toLowerCase();
					let creature = game.actors.getName(drakeactorname);
					const effect_name = draketype + " Type";
					let strike = creature.items.find(item => item.data.name == "Infused Strike");
					if (strike == null || strike == undefined)
					{
						ui.notification.error("Infused Strike Feature not found");
						return;
					}
					await strike.update({
						"data.damage.parts": [
							[
							`1d6`,
							damagetype
							]
						]}															
					);

					const effect = creature.data.effects.contents;

					for (let i = 0; i < effect.length; i++){

						let condition = effect[i].data.label;
						let effect_id = effect[i].data._id;
						
						if (condition.includes("Type"))
						{
							if  (condition != effect_name)
								await creature.updateEmbeddedDocuments("ActiveEffect", [{"_id": effect_id, "disabled" : true}]);			
							else 
								await creature.updateEmbeddedDocuments("ActiveEffect", [{"_id": effect_id, "disabled" : false}]);			
						}				
					}					
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
								var drake = await spawnActor(canvas.scene,template,draketype);
								
								//await target.document.update({ x: template.data.x, y: template.data.y } , {animate : false})
								if (removeTemplates) await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", templateArray)
								//await tactor.deleteEmbeddedDocuments("ActiveEffect", [lastArg.effectId]); 
							};
						});
						
						function spawnActor(scene, template,draketype) {	
							let protoToken = duplicate(game.actors.getName(drakeactorname).data.token);
							protoToken.x = template.data.x;
							protoToken.name = draketype + " Drake";
							protoToken.y = template.data.y;
							protoToken.flags.summoner = token.data._id;
							// Increase this offset for larger summons
							protoToken.x -= (scene.data.grid/2+(protoToken.width-1)*scene.data.grid);
							protoToken.y -= (scene.data.grid/2+(protoToken.height-1)*scene.data.grid);		 
							return canvas.scene.createEmbeddedDocuments("Token",[protoToken]);
						}
						
						
																
					
				}
			}
		},
		default: "accept_button"
	}).render(true);
}

let drakeactorname = "Drake Companion";
// use this to acticate debugging in the brwoser. useful to see what's currently happening with the code. Needs Developer Console to be on. i.e. F12
//debugger 


selectShape(drakeactorname)
/** intended for use with Item Macro. 'item' here is the spell being cast if using outside Item Macro */
/** spawns an actor with the same name as the spell at the location of the template */
