import { Context } from "egg";
import activeUserCache from "app/activeUserCache";

module.exports = () => async (ctx: Context, next) => {
  if (ctx.user && ctx.user.userId) {
    if (activeUserCache.has(ctx.user.userId)) {
      const model = activeUserCache.get(ctx.user.userId);

      if (model) {
        model && activeUserCache.set(ctx.user.userId, model);
        ctx.user.userModel = model;
      }
    } else {
      const model = await ctx.service.auth.findUserByPK(ctx.user.userId);

      if (model) {
        activeUserCache.set(ctx.user.userId, model);
        ctx.user.userModel = model;
      }
    }
  }

  ctx.service.auth.addLoginRecord();
  await next();
};
