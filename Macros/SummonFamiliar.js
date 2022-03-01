
function spawnActor(scene, template,spawnName) {
	
	let protoToken = duplicate(game.actors.getName(spawnName).data.token);
	protoToken.x = template.x;
	protoToken.name = spawnName;
	protoToken.y = template.y;
	protoToken.flags.summoner = token.data._id;
	// Increase this offset for larger summons
	protoToken.x -= (scene.data.grid/2+(protoToken.width-1)*scene.data.grid);
	protoToken.y -= (scene.data.grid/2+(protoToken.height-1)*scene.data.grid);		 
	return canvas.scene.createEmbeddedDocuments("Token",[protoToken]);
}

let spawnName = "Owl Familiar";
spawn = await spawnActor(canvas.scene,canvas.templates.placeables.map(x=>x).reverse().find(t => t.data.user == game.user.id)?.data || canvas.tokens.get(token.data._id),spawnName);
// use this to acticate debugging in the brwoser. useful to see what's currently happening with the code. Needs Developer Console to be on. i.e. F12
//debugger 

/** intended for use with Item Macro. 'item' here is the spell being cast if using outside Item Macro */
/** spawns an actor with the same name as the spell at the location of the template */
