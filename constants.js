const ROLES = {
    ADMIN_ROLE: '271232737917140992',
    DEVELOPER_ROLE: '902508392227176489'
}
const GUILD_ID = '268737069939949569'

const RESTRICTED_COMMANDS = [
    {
        commands: ['smsreport', 'mscreport', 'upsert', 'remove-command'],
        allowedRoles: [ROLES.ADMIN_ROLE, ROLES.DEVELOPER_ROLE]
    },
    ]
module.exports = {ROLES, GUILD_ID, RESTRICTED_COMMANDS}