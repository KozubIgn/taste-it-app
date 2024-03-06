import { ConnectOptions, connect } from 'mongoose';

export const dbConnect = () => {
    connect(process.env.MONGO_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions).then(
        () => console.log('connection success!'),
        (error) => console.log(error)
    )
}