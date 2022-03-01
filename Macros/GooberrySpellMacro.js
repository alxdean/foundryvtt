let tactor = canvas.tokens.controlled[0].actor

 ui.notifications.notify("A batch of goodberries has been placed in your inventory")

    await tactor.createEmbeddedDocuments("Item", [{
      "name": "Goodberry",
      "type": "consumable",
      "img": "icons/commodities/flowers/buds-black-red.webp",
      "data": {
        "description": {
          "value": "",
          "chat": "",
          "unidentified": ""
        },
        "source": "",
        "quantity": 10,
        "weight": 0,
        "price": 0,
        "attunement": 0,
        "equipped": true,
        "rarity": "",
        "identified": true,
        "activation": {
          "type": "action",
          "cost": 1,
          "condition": ""
        },
        "duration": {
          "value": null,
          "units": ""
        },
        "target": {
          "value": null,
          "width": null,
          "units": "",
          "type": "creature"
        },
        "range": {
          "value": null,
          "long": null,
          "units": "touch"
        },
        "uses": {
          "value": 1,
          "max": "1",
          "per": "charges",
          "autoDestroy": true
        },
        "consume": {
          "type": "",
          "target": "",
          "amount": null
        },
        "ability": "",
        "actionType": "util",
        "attackBonus": 0,
        "chatFlavor": "",
        "critical": null,
        "damage": {
          "parts": [],
          "versatile": ""
        },
        "formula": "",
        "save": {
          "ability": "",
          "dc": null,
          "scaling": "spell"
        },
        "consumableType": "food"
      },
      "effects": [],
      "sort": 0,
      "flags": {
        "midi-qol": {
          "effectActivation": false,
          "onUseMacroName": "[preambleComplete]ItemMacro"
        },
        "itemacro": {
          "macro": {
            "data": {
              "_id": null,
              "name": "Rations",
              "type": "script",
              "author": "a5VBgRUTddhPfSmR",
              "img": "icons/svg/dice-target.svg",
              "scope": "global",
              "command": "let player = args[0].actor;\nlet targets =args[0].targets;\nlet target = targets[0];\nlet targetActor = target.actor;\nlet healRoll = await new Roll(\"1\").evaluate();\nlet healAmount = healRoll.total;\nnew MidiQOL.DamageOnlyWorkflow(targetActor, target, healAmount, \"healing\", targets, healRoll, \n                                    {flavor: `<p>Target: ${target.name}</p>`, itemCardId: args[0].itemCardId});\n\n// let hp = target.data.data.attributes.hp.value + 1;\n// await target.update({\"data.attributes.hp.value\": hp})",
              "folder": null,
              "sort": 0,
              "permission": {
                "default": 0
              },
              "flags": {}
            }
          }
        },
        "exportSource": {
          "world": "frosty-tales",
          "system": "dnd5e",
          "coreVersion": "0.8.8",
          "systemVersion": "1.4.2"
        }
      }
    }])