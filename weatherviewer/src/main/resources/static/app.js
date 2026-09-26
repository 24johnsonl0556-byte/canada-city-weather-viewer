var city;
const capget = document.getElementById("capsubmit"); // city name
const capcity = document.getElementById("select2"); //cap city txt placement
const cap1 = document.getElementById("cap1");   //tempture
const cap2 = document.getElementById("cap2");   //wind
const cap3 = document.getElementById("cap3");   //humidity
capget.addEventListener('click', function(evt){ // this function extracts the name of the dropdown city chosen.
    evt.preventDefault();
    let text = document.getElementById('dropdownlistchoice').value;//text is city name.

    nametogeo(text);
})
async function nametogeo(a){ //every part of this works 
    let city = a.replaceAll(' ','+'); // handles space into api friendly serpation
    city = city.toLowerCase(); // pretty sure it should all be lowercase.
    try {
        let long;
        let latt;
        let link = 'https://geocoding-api.open-meteo.com/v1/search?name='+ city + '&count=1&language=en&countryCode=CA'// 
        
        let promise = await fetch(link);
        
        if(!promise.ok){ // if api can not be reached this runs
            console.log('promise not ok');
            throw new Error;
        }
        let data = await promise.json();
        if(!data.results){ //if no vaild result then this will run then kill the function.
            window.alert('unknown city');
            return;
        }
        console.log("data = "+ data.results[0].name); 
        long = data.results[0].longitude;
        latt = data.results[0].latitude;
        capcity.textContent = a;
        cityinfogetter(latt,long);//this one converts location into stats.
        return;

    }catch (error) {// this runs if api do not connect
        window.alert('can not reach api service, try again later');
        return; 
}

} 


    async function cityinfogetter(latt,long){ // this WILL get vaild latt and long.
    let link = "https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,wind_speed_10m&latitude="+ latt + "&longitude="+ long// this works properly now just finish the rest
        let temp = 'NaN'
        let wind = 'NaN'
        let humid = 'NaN'
    console.log(link);
    try {
        let request = await fetch(link);
        console.log('request gotten');
        if(!request.ok){
            throw new Error("can not get api service");
        }
        let data = await request.json();
        console.log('data gotten');
    
        if(data.current){ //I am getting the varible values, errors comes in later.
        console.log('if data passed');
        temp = data.current.temperature_2m +'C*';
        console.log('temp is '+temp);
        wind = data.current.wind_speed_10m + 'Km/H';
        console.log('wind is ' +wind);
        humid = data.current.relative_humidity_2m + '%';
        console.log('humid is '+humid);
        console.log("varible spam is passed");
        //erorr happened here.
        cap1.textContent = temp;
        cap2.textContent = wind;
        cap3.textContent = humid;
        //
        //replace the data from cape.
        return;
        }
        console.log('data did not pass');
        window.alert('can not get data');
        temp = 'NaN';
        wind = 'NaN';
        humid = 'NaN';
        cap1.textContent = temp;
        cap2.textContent = wind;
        cap3.textContent = humid;
        return;

    } catch (error) { //error happened
        console.error("can not get api service, try agaoin later");
        return; 
        
    }

}