import { GuildMember, PermissionFlagsBits } from "discord.js";

import { roleIds } from "../settings/roles";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                         DECLARATION                         *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

declare module "discord.js" {
    interface GuildMember {
        isAdmin(): boolean;
        isResponsable(): boolean;
        promotionYear(): number | null;
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                          FUNCTIONS                          *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

GuildMember.prototype.isAdmin = function () {
    return (
        this.roles.cache.has(roleIds.ADMINISTRATOR) ||
        this.permissions.has(PermissionFlagsBits.Administrator)
    );
};

GuildMember.prototype.isResponsable = function () {
    return this.roles.cache.has(roleIds.RESPONSABLE);
};

GuildMember.prototype.promotionYear = function () {
    const rolePrefix = "Volée";

    return (
        this.roles.cache
            .filter((role) => role.name.startsWith(rolePrefix))
            .map((role) => role.name.substring(rolePrefix.length))
            .map((year) => parseInt(year))
            .filter((year) => !isNaN(year))
            .sort((a, b) => a - b)
            .pop() ?? null
    );
};
