const User = require('./models/user');
const faker = require('faker');
const Poll = require('./models/poll');
function seedDb()
{
    for (let i = 0; i < 30; i++)
    {
        //generate fake User
        const newUser = { username: faker.internet.userName() };
        User.register(newUser, "password", function (err, newlyCreatedUser)
        {
            if (err)
            {
                console.log(err);
            }
            else
            {
                var totalVotes = 0;
                var options = [];
                var votes = [];
                var createdAt = getFakeDate();
                const title = faker.company.catchPhrase();
                const iterations = Math.floor(Math.random() * 3) + 2;
                const author = {
                    username: newlyCreatedUser.username,
                    id: newlyCreatedUser._id
                };
                totalVotes = makeFakeOptionsAndVotes(iterations, options, votes, totalVotes);

                //generate fake poll
                const newPoll = { title: title, options: options, votes: votes, totalVotes: totalVotes, author: author, createdAt: createdAt };
                Poll.create(newPoll, function (err)
                {
                    if (err)
                    {
                        console.log(err);
                    }
                });
            }
        });
    }
}

exports.seedDb = seedDb;


function makeFakeOptionsAndVotes(iterations, options, votes, totalVotes)
{
    for (let i = 0; i < iterations; i++)
    {
        var words = faker.random.words();
        if (words.length >= 25)
        {
            words = words.substr(0, 22) + "...";
        }
        options.push(words);
        var voteNum = Math.floor(Math.random() * 999);
        votes.push(voteNum);
        totalVotes += voteNum;
    }
    return totalVotes;
}

function getFakeDate()
{
    const earliestDate = new Date(2010, 1, 1);
    var endDate = new Date();
    var createdAt = faker.date.between(earliestDate, endDate);
    return createdAt;
}

