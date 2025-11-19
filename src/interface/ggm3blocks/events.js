Blockly.Blocks["event_whengamestarts"] = {
  /**
   * Block for when flag clicked.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "event_whengamestarts",
      message0: "When game starts",
      inputsInline: true,
      nextStatement: null,
      category: Blockly.Categories.event,
      colour: Blockly.Colours.event.primary,
    });
  },
};
