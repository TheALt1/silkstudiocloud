const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = 4000;


const url = 'mongodb://localhost:27017/silk_studios_db';
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });


cloudinary.config({
    cloud_name: 'dihlwktg7',
    api_key: '266447229813948',
    api_secret: 'pMKitShyFdfrzgc-_XISTFRZTaE' 
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));


const User = require('./User');

app.get('/Drawing-tool', (req, res) => {
    res.sendFile(path.join(__dirname, 'Drawingtool.html'));
});


app.post('/upload-to-cloudinary', async (req, res) => {
    try {
        const { image } = req.body; 

        
        const result = await cloudinary.uploader.upload(image, {
            folder: 'sketchcraft', 
        });

        
        res.status(200).json({ message: 'Image uploaded successfully!', url: result.secure_url });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
    }
});

app.get('/get-cloudinary-images', async (req, res) => {
    try {
        const result = await cloudinary.search
            .expression('folder:sketchcraft')
            .sort_by('uploaded_at', 'desc')
            .max_results(30)
            .execute();

        const imageUrls = result.resources.map(resource => resource.secure_url);
        res.status(200).json({ images: imageUrls });
    } catch (error) {
        console.error('Error fetching images from Cloudinary:', error);
        res.status(500).json({ message: 'Failed to fetch images from Cloudinary' });
    }
});



app.post('/register', (req, res) => {
    const { firstname, lastname, username, password } = req.body;
    const newUser = new User({ firstname, lastname, username, password });
    newUser.save()
        .then(() => {
            res.redirect('/index2.html');
        })
        .catch(err => {
            console.error(err);
            if (err.code === 11000) {
                res.status(409).send('User already exists!');
            } else {
                res.status(500).send('Internal Server Error');
            }
        });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findOne({ username, password })
        .then(user => {
            if (user) {
                res.redirect('/index2.html');
            } else {
                res.status(401).send('Invalid username or password');
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
