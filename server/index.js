const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const alleyCheetah = require('alley-cheetah');
const humanizeDuration = require('humanize-duration');

const app = express();
const PORT = process.env.PORT || 5000;

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

app.use(bodyParser.json());

// Answer API requests.
app.post('/api', function (req, res) {
  res.set('Content-Type', 'application/json');

  const {origin, destination, waypointGrid, babyFoodStops, key} = req.body;

  alleyCheetah.getOptimizedRoutes({origin, destination, waypointGrid, babyFoodStops, key}).then(routeWaypointPairs => {
    const routeSortKeys = ['distance', 'duration']
    let responseBody = []
    const offsets = {'Shortest': 0, 'Longest': -1}
    Object.keys(offsets).forEach(function (description) {
      routeSortKeys.forEach(function (routeSortKey) {
        const sorted = alleyCheetah.sortRoutesBy({routeWaypointPairs, routeSortKey})
        const offset = offsets[description]
        const index = (offset + sorted.length) % sorted.length
        const {route, waypoints} = sorted[index]

        const distance = alleyCheetah.getLegsTotal({route, property: 'distance'})
        const humanizedDistance = metersToMiles(distance).toFixed(2) + ' miles'

        const duration = alleyCheetah.getLegsTotal({route, property: 'duration'})
        const humanizedDuration = humanizeDuration(1000 * duration)

        const link = alleyCheetah.getMapsLink({origin, destination, waypoints})
        responseBody.push({
          link,
          description,
          routeSortKey,
          humanizedDistance,
          humanizedDuration,
        })
      })
    })

    res.json({responseBody});
  })
});

function metersToMiles (meters) {
  const milesPerMeter = 0.000621371
  return meters * milesPerMeter
}

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
