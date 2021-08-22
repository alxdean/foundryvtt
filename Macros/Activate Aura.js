token = canvas.tokens.controlled[0]
if (token.getFlag('token-auras', 'aura1.distance') == 30)
{
token.setFlag('token-auras', 'aura1.distance', 0);
}
else
{
token.setFlag('token-auras', 'aura1.distance', 30);
token.setFlag('token-auras', 'aura1.colour', '#e1dd56');
token.setFlag('token-auras', 'aura1.opacity', 0.2);
}
