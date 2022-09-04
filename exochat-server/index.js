const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const { ChannelType } = require('@onehop/js');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const axios = require('axios');


// Load environment variables from .env file
dotenv.config();

// models 
const ChatModel = require("./models/Chat");
const UserModel = require("./models/User");

const mongoose = require('mongoose');
// database
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log('Failed to Connect')
    console.log(err);
});



const app = express();
const hop = require('./hop-sdk');

app.use(bodyParser.json());




const fetchVideoDetailsV2 = async (videoId) => {
    let config = {
        method: "get",
        url: `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=contentDetails&id=${videoId}&key=AIzaSyDXwYw33IkHcndpFBwDXQb36pcCpC-il98`,
    };
    // return axios(config);

    try {
        const response = await axios(config);
        const videoStat = {
            title: "",
            duration: "",
            smallThumbnail: "",
            maxThumbnail: "",
            description: "",
        };
        const res = response.data;
        videoStat.title = res.items[0].snippet.title;
        videoStat.smallThumbnail =
            res.items[0].snippet.thumbnails.default.url;
        videoStat.maxThumbnail = res.items[0].snippet.thumbnails.maxres.url;
        videoStat.description = res.items[0].snippet.description;
        videoStat.duration =
            res.items[0].contentDetails.duration.split("PT")[1];
        // tempStats = tempStats.concat([videoStat]);
        // fetchIndex++;
        // console.log(tempStats)
        // setVideoStats(tempStats);
        // if (
        //     fetchIndex >= data.courses.data[0].attributes.videos.length
        // ) {
        //     // setVideoStats(tempStats);
        //     return;
        // } else {
        //     fetchVideoDetails(
        //         data.courses.data[0].attributes.videos[
        //             fetchIndex
        //         ].videoUrl.split("be/")[1]
        //     );
        // }
        return videoStat;
    } catch {
        console.log("error occured");
        // console.log(error);
        return {
            title: "",
        };
    }
};

app.post('/create', async (req, res) => {

    const { id } = req.body;
    // Import the ChannelType enum from Hop sdk

    // Create a channel with the ID "group_chat_1"
    const channel = await hop.channels.create(
        // Channel Type; either: "unprotected", "public", or "private"
        ChannelType.UNPROTECTED,
        // Channel ID; leave this field as null if you want an auto-generated ID
        "group_chat_1"
    );
    console.log(channel)
})

app.post('/send-message', async (req, res) => {

    let { message, videoTime, owner, videoId, trackingId } = req.body;

    if (!message) {
        return res.status(400).json({
            message: 'Message is required',
        });
    }
    if (videoTime === undefined || typeof videoTime !== 'number') {
        return res.status(400).json({
            message: 'Video time is required',
        });
    }
    if (!owner) {
        return res.status(400).json({
            message: 'Owner is required',
        });
    }
    if (!videoId) {
        return res.status(400).json({
            message: 'Video ID is required',
        });
    }

    console.log("Sending message")
    let resync = false
    // check if there are any messages with the same videoId
    // const chat = await ChatModel.findOne({ videoId: videoId });

    let create = false;

    try {
        const stats = await hop.channels.get(videoId);

    } catch {
        create = true;
    }

    if (create) {
        const details = await fetchVideoDetailsV2(videoId);
        console.log('---- details ----')
        console.log(details)
        console.log('---- details ----')


        const channel = await hop.channels.create(
            // Channel Type; either: "unprotected", "public", or "private"
            ChannelType.UNPROTECTED,
            // Channel ID; leave this field as null if you want an auto-generated ID
            videoId, {
            state: {
                videoId: videoId,
                videoTitle: details.title,
                videoDuration: details.duration,
                videoMaxThumbnail: details.maxThumbnail,
                videoSmallThumbnail: details.smallThumbnail,
                videoDescription: details.description,
            }
        }
        );
        await hop.channels.publishMessage(
            "channels",
            // event name of your choosing
            "CHANNEL_CREATE",
            // event data, this can be any object you want it to be
            {
                channelId: videoId,
            }
        )
        resync = true
    }


    // get the associated user
    const user = await UserModel.findOne({ username: owner });

    await ChatModel.create({
        message,
        videoTime,
        owner,
        videoId,
        id: uuid.v4(),
    })

    // Send a message to the channel with the ID "group_chat_1"
    const result = await hop.channels.publishMessage(
        videoId,
        // event name of your choosing
        "MESSAGE_CREATE",
        // event data, this can be any object you want it to be
        {
            message,
            videoTime,
            owner,
            userDisplayName: user.name,
            trackingId,
        }
    )

    res.status(200).send({ type: 'success', resync })
})


app.get('/msgs/:videoId', async (req, res) => {
    console.log('Get Message')
    const { videoId } = req.params;
    let msgs = await ChatModel.find({ videoId }).sort({ createdAt: -1 }).limit(10);
    msgs = msgs.reverse();

    for (let i = 0; i < msgs.length; i++) {
        const user = await UserModel.findOne({ username: msgs[i].owner });
        msgs[i] = msgs[i].toObject();
        msgs[i].userDisplayName = user.name;
        // dompurify the message
        // msgs[i].message = dompurify.sanitize(msgs[i].message);
    }
    console.log(msgs)
    res.status(200).send({
        type: 'success',
        msgs: msgs,
    });
})

app.post('/signup', async (req, res) => {
    let {
        username,
        password,
        name
    } = req.body;


    // trim all the values
    username = username.trim();
    password = password.trim();
    name = name.trim();


    // check if the values are empty
    if (!username) {
        return res.status(200).json({
            message: 'Username is required',
        });
    }
    if (!password) {
        return res.status(200).json({
            message: 'Password is required',
        });
    }
    if (!name) {
        return res.status(200).json({
            message: 'Name is required',
        });
    }


    // check if user exists
    const foundUser = await UserModel.findOne({
        username
    })
    console.log(foundUser);
    if (foundUser) {
        return res.status(200).json({
            type: 'failed',
            message: 'Username already exists',
        });
    }

    const encPass = await bcrypt.hash(password, 10);

    const user = UserModel.create({
        username,
        password: encPass,
        name,
        id: uuid.v4(),
    })

    res.status(200).send({
        type: 'success',
    })
})

app.post('/login', async (req, res) => {
    let {
        username,
        password
    } = req.body;


    // trim all the values
    username = username.trim();
    password = password.trim();

    // check if the values are empty
    if (!username) {
        return res.status(200).json({
            type: 'failed',
            message: 'Username is required',
        });
    }
    if (!password) {
        return res.status(200).json({
            type: 'failed',
            message: 'Password is required',
        });
    }

    const user = await UserModel.findOne({
        username
    })

    if (!user) {
        return res.status(200).json({
            type: 'failed',
            message: 'User does not exist',
        });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (isMatch) {
        return res.status(200).json({
            type: 'success',
            user: {
                username: user.username,
                name: user.name,
                id: user.id,
            }
        });
    } else {
        return res.status(200).json({
            type: 'failed',
            message: 'Password is incorrect',
        });
    }

})

// app.get('/stats/:id', async (req, res) => {
//     const { id } = req.params;
//     try {

//         const stats = await hop.channels.getStats(id);
//         console.log(stats)
//         res.send(stats)
//     } catch {
//         res.send('error')
//     }
// })






app.listen(5000)