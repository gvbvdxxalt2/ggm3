function generateToolbox(defaultX, defaultY) {
  var xml = "";

  xml += `
    <category name="Position" id="position" colour="#4C97FF" secondaryColour="#3373CC">
    <block type="motion_gotoxy">
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">${+defaultX}</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">${+defaultY}</field>
                </shadow>
            </value>
        </block>
    </category>
    <category name="Events" id="events" colour="#4C97FF" secondaryColour="#3373CC">
        <block type="event_whengamestarts"></block>
    </category>
    `;

  return xml;
}

module.exports = generateToolbox;
