import userModel from "../../Db/model/user.model.js";
import { asyncHandler } from "../services/errorHandling.js";
import { verifyToken } from "../services/generateAndVerifyToken.js";

export const Roles = {
  Admin: "Admin",
  User: "User",
};

export const auth = (accessRoles = []) => {

  
  return asyncHandler(async (req, res, next) => {
    // return res.json([{...Roles}])
    const { authorization } = req.headers;

    if (!authorization?.startsWith(process.env.BEARER_TOKEN)) {
      return next(new Error("invalied Token", { cause: 400 }));
    }

    const token = authorization.split(process.env.BEARER_TOKEN)[1];

    if (!token) {
      return next(new Error("invalied Token", { cause: 400 }));
    }

    const decoded = verifyToken(token, process.env.LOGIN_TOKEN);

    if (!decoded) {
      return next(new Error("invalied Token payload", { cause: 400 }));
    }

    const user = await userModel
      .findById(decoded.id)
      .select("userName role changePasswordTime email");
    if (!user) {
      return next(new Error("not rejester user", { cause: 401 }));
    }
    if (!accessRoles.includes(user.role)) {
      return next(new Error("not authorized user", { cause: 403 }));
    }
    
   

    if (decoded.iat < parseInt(user.changePasswordTime?.getTime() / 1000)) {
      return next(new Error("expire token, plz sign in agine", { cause: 400 }));
    }
    req.user = user;
    return next();
  });
};
