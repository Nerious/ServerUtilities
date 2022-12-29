export class PermissionChecker {
    constructor(){
        global.PermissionChecker = this;
    }

    /**
     * Check permissions per user.
     * @param {Object} member Member to check the permissions for.
     * @param {Object} channel The channel to check perms in.
     * @param {Object|Number} permissions All the permissions to check.
     */
    CheckMemberPermission(member, channel, permissions) {
        const missingPermissions = member.permissionsIn(channel).missing(permissions);
        return missingPermissions.length > 0? missingPermissions : undefined;
    }

    /**
     * Check if the member is positioned higher than the targetMember
     * @param {Object} member The member to check position for
     * @param {Object} targetMember The member it will be compared to
     */
    ComparePosition(member, targetMember) {
        return member.roles.highest.position <= targetMember.roles.highest.position;
    }
}