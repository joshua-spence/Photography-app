const searchBox = document.querySelector('form');
        const cardResults = document.querySelector('.results');
        var api = {
            key: 'AIzaSyAZlpkTOqa2emvDV654OBiw204i_NcGa4M',
            URL:  'https://maps.googleapis.com/maps/api/geocode/json?address='
        };

        const updateUI = (data) => {
            const newData = matrix(data);

            const orderData =  newData[1].locations.sort((a,b) => a.distance > b.distance ? 1 : -1);
            
            for(i = 0; i <= newData[1].locations.length; i++){
                
                const html = `
                <div class="card">
                    <h2>${newData[1].locations[i].town}</h2>
                    <h3>${newData[1].locations[i].postcode}</h3>
                    <p>${newData[1].locations[i].distance.toFixed(2)}km away</p>
                </div>
                `;

                cardResults.innerHTML += html;

            };
            


         };
        
        searchBox.addEventListener('submit', e => {
            e.preventDefault();

            const postcode = searchBox.postcode.value.trim();
            searchBox.reset();

            const location_req = async () => {
                const origin = await getxy(postcode);
                const locations = await sqlData();
                const results =[origin, locations];
                return results;
            };
            location_req()
                .then(data => updateUI(data))
                .catch(err => console.log('err'));
        })
        function matrix(data) {
            const dist = [];
            for(i = 0; i <= data[1].locations.length -1; i++){
                var R = 6371; 
                var rlat1 = data[0].lat * (Math.PI/180); 
                var rlat2 = data[1].locations[i].lat * (Math.PI/180); 
                var difflat = rlat2-rlat1; 
                var difflon = (data[1].locations[i].lng-data[0].lng) * (Math.PI/180); 
                
                var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
                dist.push(d);
                data[1].locations[i].distance = d;
            };
            return data;
        };
        async function sqlData() {
            const res = await fetch('/api');
            const data = await res.json();
            return data;
        }
        async function getxy(postcode) {
            const coordinates = await this.getData(postcode);
            return coordinates;
        };
        async function getData(postcode) {
            const query = `${postcode}&key=${api.key}`;
            const response = await fetch(api.URL + query);
            const data =  await response.json();
            return data.results[0].geometry.location;         
        };