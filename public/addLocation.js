const addBox = document.querySelector('form');
        const printText = document.querySelector('.print');
        var api = {
            key: 'AIzaSyAZlpkTOqa2emvDV654OBiw204i_NcGa4M',
            URL:  'https://maps.googleapis.com/maps/api/geocode/json?address='
        };


        const updateUI = (data) => {

        printText.innerHTML = ` <form action="add" method="post">
        <label for="town">Town:</label>
        <input type="text" id="town" name="town" value="${data.results[0].address_components[2].long_name}">

        <label for="postcode">Postcode:</label>
        <input type="text" id="postcode" name="postcode" value="${data.results[0].address_components[0].long_name}">

        <label for="lat">Lat:</label>
        <input type="text" id="lat" name="lat" value="${data.results[0].geometry.location.lat}">

        <label for="lng">Lng:</label>
        <input type="text" id="lng" name="lng" value="${data.results[0].geometry.location.lng}">
        <button>Submit</button>
        </form>                  
        `
        };


        addBox.addEventListener('submit', e => {
            e.preventDefault();

            const postcode = addBox.postcode.value.trim();
            addBox.reset();

            const find_location = async () => {
                const newLocation = await getxy(postcode);
                return newLocation;
            }
            find_location()
                .then(data => updateUI(data))
                .catch(err => console.log(err));
        })

        async function getxy(postcode) {
            const coordinates = await this.getData(postcode);
            return coordinates;
        };
        async function getData(postcode) {
            const query = `${postcode}&key=${api.key}`;
            const response = await fetch(api.URL + query);
            const data =  await response.json();
            return data;         
        };