function generateToolbox(defaultX, defaultY) {
  var xml = "";

  xml += `
    <category name="Position" id="position" colour="#4C97FF" secondaryColour="#3373CC">
    <block type="motion_gotoxy">
            <value name="X">
                <shadow id="movex" type="math_number">
                    <field name="NUM">${+defaultX}</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="movey" type="math_number">
                    <field name="NUM">${+defaultY}</field>
                </shadow>
            </value>
        </block>
    </category>
    `;

  return xml;
}

module.exports = generateToolbox;
