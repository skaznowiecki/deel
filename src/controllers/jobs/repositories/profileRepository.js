const { Profile } = require("../../../model");

class ProfileRepository {
  findById(id) {
    return Profile.findByPk(id);
  }
}

exports.ProfileRepository = ProfileRepository;
