if (args[0] === "on") {
    //this activates on each person in radius when the aura effect is applied. 
        token.document.setFlag('token-auras', 'aura1.distance', 30);
        token.document.setFlag('token-auras', 'aura1.colour', '#9b35c0');
        token.document.setFlag('token-auras', 'aura1.opacity', 0.2);        
}

if (args[0] === "off") {
        token.document.setFlag('token-auras', 'aura1.distance', 0);
    
}