import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Pusher from 'pusher';
import dbModel from './dbModel.js';


// ****** APPLICATION CONFIGURATION *****
const app = express();
const port = process.env.PORT || 3000

let KEY = "";
let SECRET = "";


const pusher = new Pusher({
  appId: "1182441",
  key: KEY,
  secret: SECRET,
  cluster: "us2",
  useTLS: true
});



// ****** THE MIDDLEWARE ******
app.use(express.json())  // allows to process json files
app.use(cors())


// ****** DB CONFIGURATION ****** 
const connection_url = 'ADD MONGODB INFO HERE';
mongoose.connect(connection_url, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
	console.log('DB is connected')

	const changeStream = mongoose.connection.collection('posts').watch()
	changeStream.on('change', (change) => {
		console.log("change Stream triggered on pusher")

		if (change.operationType === 'insert') {
			console.log('triggering pusher IMG UPLOAD')

			const postDetails - change.fullDocument;
			pusher.trigger('posts', 'inserted' {
				user: postDetails.user,
				caption: postDetails.caption
				image: postDetails.image
			})
		} else {
			console.log("Unknown trigger from pusher")
		}
	})
})

// ****** API ROUTES ******
app.get('/', (req,res) => res.status(200).send("hello world"))

app.post('/upload', (req, res) => {
	const body = req.body;
	dbModel.create(body, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	})
});


app.get('/sync', (req, res) => {
	dbModel.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	})
})


// able to upload some image, and be able to return it to the DB
app.post('/upload', (req, res)=>{    

})



// ******* THE LISTENING PORT *******

app.listen(port, () => 
	console.log(`App listening on port: ${port}`))

