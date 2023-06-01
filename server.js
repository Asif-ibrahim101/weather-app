import express from 'express';
import path from 'path';
import fetch from 'node-fetch';

const port = 4000;
const app = express();
const dirname = path.dirname('public');
console.log(dirname);


app.use(express.static(path.dirname('./public/styles')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('home', {
        city: null,
        des: null,
        icon: null,
        temp: null,
        speed: null,
        humidity: null
    });
});

app.post('/', async (req, res) => {
    const city = req.body.place;
    const api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=b598a7175e8b3cd4d0862897492feb91`;

    try {
        await fetch(api)
          .then(res => res.json())
          .then(data => {
            if (data.message === 'city not found') {
              res.render('home', {
                city: data.message,
                des: null,
                icon: null,
                temp: null,
                speed: null,
                humidity: null
              })
            } else {
              const city = data.name;
              const des = data.weather[0].description;
              const icon = data.weather[0].icon;
              const temp = data.main.temp;
              const speed = data.wind.speed;
              const humidity = data.main.humidity;
    
              res.render('home', {
                city, des, icon, temp, speed, humidity
              });
            }
          });
    
      } catch (err) {
        res.render('home', {
          city: 'something wrong',
          des: null,
          icon: null,
          temp: null,
          speed: null,
          humidity: null
        })
      }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
