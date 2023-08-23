import { Roles } from "../../MiddleWare/auth.middleware.js";

export const endPoints ={
create : [Roles.User] ,
update : [Roles.Admin],
get : [Roles.Admin, Roles.User]


}