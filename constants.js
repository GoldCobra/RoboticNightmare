const ROLES = {
    ADMIN: '271232737917140992',
    DEVELOPER: '902508392227176489',
    MEGASTRIKER: '862990625540407316',
    LEGEND: '862992675384197120',
    SUPERSTAR: '910803745447747584',
    PROFESSIONAL: '910803654859173898',
    ROOKIE: '910803451678703616',
    MSC_DOLPHIN: '915981506898460742',
    SMS_PLAYER: '781487757176209428',
    MSC_PLAYER: '680810288605298744',
    MSC_FAN: '862237914863239198',
    SMS_FAN: '862237991635124244',
    MODDING: '862238264752996372',
    TOURNAMENT: '862238161395908628',
    MSBL: '944674641446858793',
    MSBL_LFG: '944150830972538923',
    MSL: '944675093525692496',
    MSBL_SPECTATOR: '944675392839626824',
    MSC_SPECTATOR: '944675434216427601',
    SMS_SPECTATOR: '944675472170713128',
    SERVER_STAFF: '271233314252259330'

}
const PLAYER_ROLES = [ROLES.MEGASTRIKER, ROLES.LEGEND,ROLES.SUPERSTAR,ROLES.PROFESSIONAL,ROLES.ROOKIE]
const GUILD_ID = '268737069939949569'
const CHANNELS = {
    DEBUG_CHANNEL: '910923586636771409',
    COMMAND_SANDBOX_CHANNEL: '897757084299431936',
    RULE_CHANNEL: '894852972117372988',
    SERVER_ROLES_CHANNEL: '896363013811097650',
    MSC_DOLPHIN_DRAFT: '862333591265869846',
    MSC_DOMINATION_DRAFT: '710462330369998908',
    GRUDGE_MATCH: '273005041877647371'
}

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
const EXTERNAL_BOT_COMMANDS = ['!flag', '!code', '!error']
module.exports = {ROLES,PLAYER_ROLES, GUILD_ID, CHANNELS, RESTRICTED_COMMANDS, MSC_SK, MSC_CAPTAINS, MSC_ALL_STADIUMS, MSC_COMP_STADIUMS, SMS_ALL_STADIUMS, SMS_COMP_STADIUMS, SMS_SK, SMS_CAPTAIN, EXTERNAL_BOT_COMMANDS};
