//DAE Macro Execute, Effect Value = "Macro Name" @target 
if (!game.modules.get("advanced-macros")?.active) ui.notifications.error("Please enable the Advanced Macros module")

const lastArg = args[args.length - 1];
let tactor;
if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
else tactor = game.actors.get(lastArg.actorId);
const target = canvas.tokens.get(lastArg.tokenId) || token;

let mod = tactor.data.data.abilities[args[2]].mod

let data = {}
//debugger
/**
 * Create Spiritual Weapon item in inventory
 */
if (args[0] === "on") {
	function selectShape(){
		let typeDialogOptions = "";
			
		typeDialogOptions += `<option value="Owl Spirit">Air</option>`;
		typeDialogOptions += `<option value="Shark Spirit">Water</option>`;
		typeDialogOptions += `<option value="Wolf Spirit">Land</option>`;
		let dialogContent = `
							<h2>Select your Type</h2>
							<div style="flex:1">Type:<select name="beast">${typeDialogOptions}</select></div>
							`;
		new Dialog({
			title: "Beast Type",
			content: dialogContent,
			buttons: {
				accept_button: {
					label: `<i class="fas fa-shield-cat"></i>Summon Beast!`,
					callback: async (html) => { 
						//debugger                   
						let Beast = html.find("[name=beast]")[0].value;						
						let creature = game.actors.getName(Beast);
						let damage = args[1];         
						
						let strike = creature.items.find(item => item.data.type == "weapon");
						if (strike == null || strike == undefined)
						{
							ui.notification.error("Attack not found");
							return;
						}

						await strike.update({
							"data.damage.parts": [
								[
								`1d8 +4 + ${damage}`,
								'piercing'
								]
							]}															
						);
						
						
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
								debugger
								let beasts = await spawnActor(canvas.scene,template,Beast);
								//let beasts = canvas.tokens.ownedTokens.filter(i => i.data.flags.summoner === tactor.id)
								if (beasts.length>0)
								{
									var beast = beasts[0];
									var newac = 11 + damage
									let newhp = 30 + ((damage-2) * 5)
									await beast.actor.update({'data.attributes.ac' : { 'value': newac, 'flat': newac, 'base': newac}});								  
									if (Beast='Owl Spirit')
										newhp = 20 + ((damage-2) * 5)
									await beast.actor.update({'data.attributes.hp' : {'value': newhp, 'max' : newhp}});								  
								}
		
								//await target.document.update({ x: template.data.x, y: template.data.y } , {animate : false})
								if (removeTemplates) await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", templateArray)
								//await tactor.deleteEmbeddedDocuments("ActiveEffect", [lastArg.effectId]); 
							};
						});												
					}
				}
			},
			default: "accept_button"
		}).render(true);
	}

	function spawnActor(scene, template, Beast) {
		debugger
		let protoToken = duplicate(game.actors.getName(Beast).data.token);
		protoToken.x = template.data.x;
		protoToken.name = Beast;
		protoToken.y = template.data.y;
		protoToken.flags.summoner = tactor.id;
		// Increase this offset for larger summons
		protoToken.x -= (scene.data.grid/2+(protoToken.width-1)*scene.data.grid);
		protoToken.y -= (scene.data.grid/2+(protoToken.height-1)*scene.data.grid);		 
		return canvas.scene.createEmbeddedDocuments("Token",[protoToken]);
	}

	// use this to activate debugging in the brwoser. useful to see what's currently happening with the code. Needs Developer Console to be on. i.e. F12
	//debugger 
	selectShape()
	/** intended for use with Item Macro. 'item' here is the spell being cast if using outside Item Macro */
	/** spawns an actor with the same name as the spell at the location of the template */
}
if (args[0] === "off") {
  
	let beasts = canvas.tokens.ownedTokens.filter(i => i.data.flags.summoner === tactor.id)
  if (beasts.length>0)
	await canvas.scene.deleteEmbeddedDocuments("Token", [beasts[0].id])
  }
  