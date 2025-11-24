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
    <block type="motion_xposition"></block>
    <block type="motion_yposition"></block>
    <block type="motion_direction"></block>
    </category>
    <category name="Events" id="events" colour="${Blockly.Colours.event.primary}" secondaryColour="${Blockly.Colours.event.secondary}">
        <block type="event_whengamestarts"></block>
    </category>
    <category name="Sensing" id="sensing" colour="${Blockly.Colours.sensing.primary}" secondaryColour="${Blockly.Colours.sensing.secondary}">
        <block type="sensing_mousex"></block>
        <block type="sensing_mousey"></block>
        <block type="sensing_mousedown" gap="30"></block>
		<block type="sensing_keypressed">
			<value name="KEY_OPTION">
				<shadow type="sensing_keyoptions"></shadow>
			</value>
		</block>
    </category>
	<category name="Loader" id="loader" colour="#0066a1" secondaryColour="#0066a1">
		<block type="loader_loadcostume">
			<value name="COSTUME">
				<shadow type="loader_costume"></shadow>
			</value>
		</block>
		<block type="loader_deloadcostume">
			<value name="COSTUME">
				<shadow type="loader_costume"></shadow>
			</value>
		</block>
        <block type="loader_costumeisloaded">
			<value name="COSTUME">
				<shadow type="loader_costume"></shadow>
			</value>
		</block>
        <block type="loader_rendercostumescale">
            <value name="COSTUME">
				<shadow type="loader_costume"></shadow>
			</value>
			<value name="SCALE">
				<shadow type="math_number">
                    <field name="NUM">3</field>
                </shadow>
			</value>
		</block>
        <block type="loader_setrenderscale">
            <value name="COSTUME">
				<shadow type="loader_costume"></shadow>
			</value>
		</block>
        <block type="loader_costume_scale">
            <value name="COSTUME">
				<shadow type="loader_costume"></shadow>
			</value>
		</block>
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
        <block type="control_forever">
        </block>
        <block type="control_if">
        </block>
        <block type="control_if_else">
        </block>
        <block type="control_wait_until">
        </block>
        <block type="control_repeat_until">
        </block>
        <block type="control_while">
        </block>
    </category>
    <category name="Operators" id="operators" colour="${Blockly.Colours.operators.primary}" secondaryColour="${Blockly.Colours.operators.secondary}">
        <block type="operator_add">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="operator_subtract">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="operator_multiply">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="operator_divide">
            <value name="NUM1">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="NUM2">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="operator_random">
            <value name="FROM">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="operator_sign">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="operator_fixed">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="DECIMALS">
                <shadow type="math_number">
                    <field name="NUM">2</field>
                </shadow>
            </value>
        </block>
        <block type="operator_mathop" gap="30">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="operator_equals">
            <value name="OPERAND1">
                <shadow type="text"></shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="text"></shadow>
            </value>
        </block>
        <block type="operator_gt">
            <value name="OPERAND1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="operator_lt">
            <value name="OPERAND1">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="OPERAND2">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="operator_and"></block>
        <block type="operator_or"></block>
        <block type="operator_not" gap="30"></block>
		<block type="operator_outputif">
            <value name="CONDITION"></value>
            <value name="PASS_OUTPUT">
                <shadow type="text">
                    <field name="TEXT">apple</field>
                </shadow>
            </value>
			<value name="FAIL_OUTPUT">
                <shadow type="text">
                    <field name="TEXT">orange</field>
                </shadow>
            </value>
        </block>
        <block type="operator_true"></block>
        <block type="operator_false"></block>
        <block type="operator_nan"></block>
        <block type="operator_null"></block>
        <block type="operator_infinity"></block>
        <block type="operator_empty_string"></block>
        <block type="operator_newline" gap="30"></block>
		<block type="operator_tostring">
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
		</block>
		<block type="operator_tonumber">
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
		</block>
		<block type="operator_toboolean">
            <value name="VALUE">
                <shadow type="text"></shadow>
            </value>
		</block>
    </category>
    <category name="Looks" id="looks" colour="${Blockly.Colours.looks.primary}" secondaryColour="${Blockly.Colours.looks.secondary}">
        <block type="looks_show"></block>
        <block type="looks_hide"></block>
        <block type="looks_hidden"></block>
        <block type="looks_visible" gap="30"></block>
        <block type="looks_changesizeby">
            <value name="CHANGE">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="looks_setsizeto">
            <value name="SIZE">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="looks_size" gap="30"></block>
		<block type="looks_xstretch_to">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
		<block type="looks_ystretch_to">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
		<block type="looks_xstretch"></block>
		<block type="looks_ystretch"></block>
		<!--<block type="error_test"></block>--> <!--This is just a block used to check if error handling works-->
    </category>
    <category name="Variables" id="data" colour="#FF8C1A" secondaryColour="#DB6E00" custom="GGM3_VARIABLE">
    </category>
    `;

  return xml;
}

module.exports = generateToolbox;
