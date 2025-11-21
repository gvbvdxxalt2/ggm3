function generateToolbox(defaultX, defaultY) {
  var xml = "";

  xml += `
    <category name="Motion" id="motion" colour="${Blockly.Colours.motion.primary}" secondaryColour="${Blockly.Colours.motion.secondary}">
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
        <block type="motion_changexby">
            <value name="DX">
            <shadow type="math_number">
                <field name="NUM">10</field>
            </shadow>
        </value>
        </block>
        <block type="motion_changeyby">
        <value name="DY">
        <shadow type="math_number">
            <field name="NUM">10</field>
        </shadow>
    </value>
    </block>
    <block type="motion_pointindirection">
    <value name="DIRECTION">
        <shadow type="math_angle">
            <field name="NUM">90</field>
        </shadow>
    </value>
    </block>
    <block type="motion_turnright">
    <value name="DEGREES">
        <shadow type="math_number">
            <field name="NUM">15</field>
        </shadow>
    </value>
    </block>
    <block type="motion_turnleft">
    <value name="DEGREES">
        <shadow type="math_number">
            <field name="NUM">15</field>
        </shadow>
    </value>
    </block>
    <block type="motion_movesteps">
    <value name="STEPS">
        <shadow type="math_number">
            <field name="NUM">10</field>
        </shadow>
    </value>
    </block>
    </category>
    <category name="Events" id="events" colour="${Blockly.Colours.event.primary}" secondaryColour="${Blockly.Colours.event.secondary}">
        <block type="event_whengamestarts"></block>
    </category>
    <category name="Sensing" id="sensing" colour="${Blockly.Colours.sensing.primary}" secondaryColour="${Blockly.Colours.sensing.secondary}">
        <block type="sensing_mousex"></block>
        <block type="sensing_mousey"></block>
    </category>
    <category name="Control" id="Control" colour="${Blockly.Colours.control.primary}" secondaryColour="${Blockly.Colours.control.secondary}">
        <block type="control_wait">
            <value name="DURATION">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="control_repeat">
            <value name="TIMES">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
    </category>
    <category name="Variables" id="data" colour="#FF8C1A" secondaryColour="#DB6E00" custom="VARIABLE">
    </category>
    `;

  return xml;
}

module.exports = generateToolbox;
