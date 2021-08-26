let tactor = canvas.tokens.controlled[0].actor

 ui.notifications.notify("A batch of goodberries has been placed in your inventory")

    await tactor.createOwnedItem({
  "name": "Goodberry",
  "type": "consumable",
  "img": "icons/commodities/flowers/buds-black-red.webp",
  "data": {
    "description": {
      "value": "",
      "chat": "",
      "unidentified": ""
    },
    "source": "Custom",
    "quantity": 10,
    "weight": 0,
    "equipped": true,
    "activation": {
      "type": "action",
      "cost": 1,
      "condition": ""
    },
    "uses": {
      "value": 1,
      "max": "1",
      "per": "charges",
      "autoDestroy": true
    },
    "actionType": "util",
    "consumableType": "food"
  },
  "flags": {
    "midi-qol": {
      "onUseMacroName": "Award Goodberry"
    }
  }
})