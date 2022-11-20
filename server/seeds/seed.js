const db = require('../config/connection');
//const { User, Team } = require('../models');
const { User } = require("../models");
const userSeeds = require('./userSeeds.json');
//const teamSeeds = require('./teamSeeds.json');

db.once('open', async () => {
  try {
    //await Team.deleteMany({});
    await User.deleteMany({});

    await User.create(userSeeds);

    // for (let i = 0; i < teamSeeds.length; i++) {
    //   const { _id, thoughtAuthor } = await Thought.create(thoughtSeeds[i]);
    //   const user = await User.findOneAndUpdate(
    //     { username: thoughtAuthor },
    //     {
    //       $addToSet: {
    //         thoughts: _id,
    //       },
    //     }
    //   );
    // }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});
