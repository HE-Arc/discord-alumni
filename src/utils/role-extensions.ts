import { Role } from "discord.js";

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                         DECLARATION                         *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

declare module "discord.js" {
    interface Role {
        isPromotionYear(): boolean;
        promotionYear(): number | null;
    }
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *\
|*                          FUNCTIONS                          *|
\* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

Role.prototype.isPromotionYear = function () {
    const rolePrefix = "Volée";

    return (
        this.name.startsWith(rolePrefix) &&
        !isNaN(parseInt(this.name.substring(rolePrefix.length)))
    );
};

Role.prototype.promotionYear = function () {
    if (!this.isPromotionYear()) return null;

    const rolePrefix = "Volée";

    return parseInt(this.name.substring(rolePrefix.length));
};
