import { Roles } from "../../MiddleWare/auth.middleware.js";

export const endPoints ={
create : [Roles.Admin] ,
update : [Roles.Admin],
get : [Roles.Admin, Roles.User]


}