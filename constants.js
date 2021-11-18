const ROLES = {
    ADMIN_ROLE: '271232737917140992',
    DEVELOPER_ROLE: '902508392227176489'
}
const GUILD_ID = '268737069939949569'
const DEBUG_CHANNEL = '910923586636771409'

const RESTRICTED_COMMANDS = [
    {
        commands: ['smsreport', 'mscreport', 'upsert', 'remove-command'],
        allowedRoles: [ROLES.ADMIN_ROLE, ROLES.DEVELOPER_ROLE]
    },
    ]
const MSC_SK = ['mscboo','mscdrybones', 'mscbirdo', 'mschammerbro', 'mscmonty', 'msckoopa', 'msctoad', 'mscshyguy'];
const MSC_CAPTAINS = ['mscwaluigi', 'mscdk', 'mscpetey', 'mscdaisy', 'mscwario', 'mscbowser', 'mscmario', 'mscluigi', 'mscpeach', 'mscyoshi', 'mscdiddy', 'mscbowserjr']
const MSC_ALL_STADIUMS = ['The Classroom', 'The Sand Tomb', 'The Palace', 'Thunder Island', 'Pipeline Central', 'Konga Coliseum', 'The Underground', 'The Wastelands',
'Crater Field', 'The Dump', 'The Vice', 'Crystal Canyon', 'The Battle Dome', 'The Lava Pit', 'Galactic Stadium', 'Bowser Stadium', 'Stormship Stadium'];
const MSC_COMP_STADIUMS = ['The Classroom', 'The Lava Pit', 'Cystal Canyon', 'Bowser Stadium'];
const SMS_ALL_STADIUMS = ['The Battle Dome', 'Bowser Stadium', 'Crater Field', 'Konga Coliseum', 'The Palace', 'Pipeline Central', 'The Underground'];
const SMS_COMP_STADIUMS = ['The Battle Dome', 'Bowser Stadium', 'Crater Field', 'Konga Coliseum', 'The Palace', 'Pipeline Central', 'The Underground'];
const SMS_SK = ['smstoad', 'smskoopa', 'smsbirdo', 'smshammerbro'];
const SMS_CAPTAIN = ['smswaluigi', 'smswario', 'smsdk', 'smspeach', 'smsdaisy', 'smsluigi', 'smsmario', 'smsyoshi'];
module.exports = {ROLES, GUILD_ID, DEBUG_CHANNEL, RESTRICTED_COMMANDS, MSC_SK, MSC_CAPTAINS, MSC_ALL_STADIUMS, MSC_COMP_STADIUMS, SMS_ALL_STADIUMS, SMS_COMP_STADIUMS, SMS_SK, SMS_CAPTAIN};
