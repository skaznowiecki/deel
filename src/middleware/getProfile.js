const AuthenticationException = require("../exceptions/authentication");

const getProfile = async (req, res, next) => {
  try {
    const { Profile } = req.app.get("models");
    const profile = await Profile.findOne({
      where: { id: req.get("profile_id") || 0 },
    });

    if (!profile) {
      throw new AuthenticationException();
    } else {
      req.profile = profile;
      next();
    }
  } catch (error) {
    next(error);
  }
};
module.exports = { getProfile };
