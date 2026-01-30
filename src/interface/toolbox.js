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
        <block type="motion_setx">
            <value name="X">
                <shadow type="math_number">
                    <field name="NUM">${defaultX}</field>
                </shadow>
            </value>
        </block>
        <block type="motion_sety">
            <value name="Y">
                <shadow type="math_number">
                    <field name="NUM">${defaultY}</field>
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
        <block type="event_beforegamestarts"></block>
        <block type="event_whengamestarts"></block>
    </category>
    <category name="Broadcasting" id="broadcasting" colour="#bf9c00" secondaryColour="#bf9c00" custom="GGM3_BROADCASTING">
    </category>
    <category name="Sensing" id="sensing" colour="${Blockly.Colours.sensing.primary}" secondaryColour="${Blockly.Colours.sensing.secondary}">
        <block type="sensing_touchingobject" id="sensing_touchingobject">
            <value name="TOUCHINGOBJECTMENU">
                <shadow type="sensing_touchingobjectmenu">
                </shadow>
            </value>
        </block>
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
        <block type="loader_costume_scale" gap="30">
            <value name="COSTUME">
				<shadow type="loader_costume"></shadow>
			</value>
		</block>
		<block type="loader_soundisloaded">
			<value name="SOUND">
				<shadow type="loader_sound"></shadow>
			</value>
		</block>
		<block type="loader_loadsound">
			<value name="SOUND">
				<shadow type="loader_sound"></shadow>
			</value>
		</block>
		<block type="loader_deloadsound" gap="30">
			<value name="SOUND">
				<shadow type="loader_sound"></shadow>
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
        <block type="control_while" gap="30">
        </block>
        <block type="control_stop" gap="30"></block>
        <block type="control_elapsed" gap="30"></block>
        <block type="control_isclone"></block>
        <block type="control_start_as_clone">
        </block>
        <block type="control_create_clone_of">
            <value name="CLONE_OPTION">
                <shadow type="control_create_clone_of_menu"></shadow>
            </value>
        </block>
        <block type="control_delete_this_clone">
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
        <block type="operator_round">
            <value name="NUM">
                <shadow type="math_number"></shadow>
            </value>
		</block>
        <block type="operator_mathop">
            <value name="NUM">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
		<block type="operator_joinstring" gap="30">
			<value name="VALUE1">
                <shadow type="text">
					<field name="TEXT">apple</field>
				</shadow>
            </value>
            <value name="VALUE2">
                <shadow type="text">
					<field name="TEXT">banana</field>
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
		<block type="looks_stretch_to">
            <value name="XVALUE">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
			<value name="YVALUE">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
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
        <block type="looks_xstretch_by">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">5</field>
                </shadow>
            </value>
        </block>
		<block type="looks_ystretch_by">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">5</field>
                </shadow>
            </value>
        </block>
		<block type="looks_xstretch"></block>
		<block type="looks_ystretch" gap="30"></block>
	
        <block type="looks_switchcostumeto">
            <value name="COSTUME">
                <shadow type="looks_costume"></shadow>
            </value>
        </block>
        <block type="looks_nextcostume"></block>
        <block type="looks_costumenumbername"></block>
		<block type="looks_costumenames"></block>
		<block type="looks_costumes" gap="30"></block>

        <block type="looks_alpha"></block>
        <block type="looks_alpha_to">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="looks_alpha_by" gap="30">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">5</field>
                </shadow>
            </value>
        </block>

        <block type="looks_zindex"></block>
        <block type="looks_zindex_to">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="looks_zindex_by" gap="30">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>

        <block type="looks_seteffectto">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="looks_change_effect_by">
            <value name="BY">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="looks_geteffect"></block>
			
		
		<label text="These do NOT affect collison:"></label>
		<block type="looks_skew_to">
            <value name="XVALUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
			<value name="YVALUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
		<block type="looks_xskew_to">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
		<block type="looks_yskew_to">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="looks_xskew_by">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>
		<block type="looks_yskew_by">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>
		<block type="looks_xskew"></block>
		<block type="looks_yskew" gap="30"></block>
		
		<!--<block type="error_test"></block>--> <!--This is just a block used to check if error handling works-->
    </category>
    <category name="Sounds" id="sounds" colour="${Blockly.Colours.sounds.primary}" secondaryColour="${Blockly.Colours.sounds.secondary}">
        <block type="sound_play">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"></shadow>
            </value>
        </block>
        <block type="sound_playuntildone">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"></shadow>
            </value>
        </block>
        <block type="sound_play_advanced">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"></shadow>
            </value>
            <value name="PLAYBACK_RATE">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TIME">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="sound_playuntildone_advanced" gap="30">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"></shadow>
            </value>
            <value name="PLAYBACK_RATE">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TIME">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="sound_stopallsounds"></block>
        <block type="sound_stopallsoundsinsprite"></block>
        <block type="sound_stopsound">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu"></shadow>
            </value>
        </block>
    </category>
    <category name="Game" id="engine" colour="#77a1b5" secondaryColour="#77a1b5">
        <block type="engine_framerate_to">
            <value name="FPS">
                <shadow type="math_number">
                    <field name="NUM">60</field>
                </shadow>
            </value>
        </block>
        <block type="engine_framerate"></block>
    </category>
    <category name="Variables" id="data" colour="#FF8C1A" secondaryColour="#DB6E00" custom="GGM3_VARIABLE">
    </category>
    <category name="Global Variables" id="data_global" colour="#00c756" secondaryColour="#00c756" custom="GGM3_GLOBAL_VARIABLE">
    </category>
    <category
        name="My blocks"
        id="myBlocks"
        colour="#FF6680"
        secondaryColour="#FF4D6A"
        custom="PROCEDURE">
    </category>
    <category name="JSON" id="json" colour="#058fff" secondaryColour="#058fff">
        <block type="json_new"></block>
        <label text="Object operations:"></label>
        <block type="json_setto">
            <value name="NAME">
                <shadow type="text">
                    <field name="TEXT">variable</field>
                </shadow>
            </value>
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">value</field>
                </shadow>
            </value>
        </block>
        <block type="json_deleteon">
            <value name="NAME">
                <shadow type="text">
                    <field name="TEXT">variable</field>
                </shadow>
            </value>
        </block>
        <block type="json_geton">
            <value name="NAME">
                <shadow type="text">
                    <field name="TEXT">variable</field>
                </shadow>
            </value>
        </block>
        <block type="json_keys" gap="30"></block>
        <label text="From and to string operations:"></label>
        <block type="json_tostring"></block>
        <block type="json_fromstring" gap="30"></block>
        <label text="Array operations:"></label>
        <block type="json_array_push">
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">value</field>
                </shadow>
            </value>
        </block>
        <block type="json_array_unshift">
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">value</field>
                </shadow>
            </value>
        </block>
        <block type="json_array_lengthof"></block>
        <block type="json_array_indexof">
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">value</field>
                </shadow>
            </value>
        </block>
        <block type="json_array_pop"></block>
        <block type="json_array_contains">
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">value</field>
                </shadow>
            </value>
        </block>
        <label text="Path / deep ops:"></label>
        <block type="json_get_path">
            <value name="PATH">
                <shadow type="text">
                    <field name="TEXT">a.b.c</field>
                </shadow>
            </value>
        </block>
        <block type="json_set_path">
            <value name="PATH">
                <shadow type="text">
                    <field name="TEXT">a.b.c</field>
                </shadow>
            </value>
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">value</field>
                </shadow>
            </value>
        </block>
        <block type="json_delete_path">
            <value name="PATH">
                <shadow type="text">
                    <field name="TEXT">a.b.c</field>
                </shadow>
            </value>
        </block>
        <label text="Utilities:"></label>
        <block type="json_clone"></block>
        <block type="json_parse_safe">
            <value name="STRING">
                <shadow type="text">
                    <field name="TEXT">{"a":1}</field>
                </shadow>
            </value>
        </block>
        <block type="json_pretty_print"></block>
		<block type="json_typeof"></block>
    </category>
    `;

  return xml;
}

module.exports = generateToolbox;
