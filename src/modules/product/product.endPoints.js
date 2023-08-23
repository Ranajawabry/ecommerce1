import { Roles } from "../../MiddleWare/auth.middleware.js";


export const endPoints ={
create : [Roles.Admin] ,
update : [Roles.Admin],
get : [Roles.Admin, Roles.User],
softDeleted : [Roles.Admin],
forceDeleted:[Roles.Admin],
restore:[Roles.Admin],
getsoftDeleted:[Roles.Admin],
getProduct:[Roles.Admin,Roles.User],
getProducts:[Roles.Admin,Roles.User],
addTowishList:[Roles.User]
}