import * as waitingForValidation from "./roles-added/waiting-for-validation";

import * as promotionYearChanged from "./roles-changed/promotion-changed";

import { roleIds } from "./../settings/roles";

/* * * * * * * * * * * * * * * *\
|*           EXPORTS           *|
\* * * * * * * * * * * * * * * */

export const events = {
    [roleIds.WAITING_FOR_VALIDATION]: waitingForValidation,
};

export const eventsRolesChanged = [promotionYearChanged];
