import axios from "axios";

const form = document.querySelector("form") as HTMLFormElement;
const addressInput = document.getElementById("address") as HTMLInputElement;
const google_api_key = "AIzaSyC9fPejS2xiHABFO9UFtVOMICSy-BLq1xY"; //if you've cloned this repo remember to paste in your own google api key as this one has limited daily request quota
//paste the same key at the head section of 'index.html' file.
     
// declare var google: any;

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS" | "OVER_QUERY_LIMIT";
};
function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${google_api_key}`
    )
    .then((response) => {
      if (response.data.status === "ZERO_RESULTS") {
        throw new Error("The requested address cannot be found");
      }else if(response.data.status === "OVER_QUERY_LIMIT") {
        throw new Error("Sorry, but we've exceeded our daily request quota for today");
      }

      const coordinates = response.data.results[0].geometry.location;

      const map = new google.maps.Map(document.getElementById("map")!, {
        center: coordinates,
        zoom: 8,
      });

      new google.maps.Marker({position: coordinates, map: map});
    })
    .catch((err) => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);
