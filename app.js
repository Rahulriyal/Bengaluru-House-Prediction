function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i = 0; i < uiBathrooms.length; i++) {
      if (uiBathrooms[i].checked) {
          return parseInt(uiBathrooms[i].value);
      }
  }
  return -1;
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i = 0; i < uiBHK.length; i++) {
      if (uiBHK[i].checked) {
          return parseInt(uiBHK[i].value);
      }
  }
  return -1;
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");

  var sqft = document.getElementById("uiSqft").value; // ✅ Ensure correct value usage
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations").value; // ✅ Ensure correct value usage
  var estPrice = document.getElementById("uiEstimatedPrice");

  // ✅ Log user input before sending to API
  console.log("Sending data:", {
      total_sqft: sqft,
      bhk: bhk,
      bath: bathrooms,
      location: location
  });

  // ✅ Use dynamic API URL to prevent hardcoded issues
  var url = window.location.origin + "/api/predict_home_price"; 

  fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          total_sqft: parseFloat(sqft),
          bhk: bhk,
          bath: bathrooms,
          location: location
      })
  })
  .then(response => response.json())
  .then(data => {
      console.log("Response from API:", data); // ✅ Log API response
      estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
  })
  .catch(error => {
      console.error("Error fetching estimated price:", error);
      estPrice.innerHTML = "<h2>Error fetching price</h2>";
  });
}

function onPageLoad() {
  console.log("Document loaded");

  // ✅ Use dynamic API URL instead of hardcoding
  var url = window.location.origin + "/api/get_location_names"; 

  fetch(url)
  .then(response => response.json())
  .then(data => {
      console.log("Got response for get_location_names request", data);
      if (data) {
          var locations = data.locations;
          var uiLocations = document.getElementById("uiLocations");
          $('#uiLocations').empty();
          for (var i in locations) {
              var opt = new Option(locations[i]);
              $('#uiLocations').append(opt);
          }
      }
  })
  .catch(error => {
      console.error("Error fetching location names:", error);
  });
}

window.onload = onPageLoad;
