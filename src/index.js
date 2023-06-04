const {request, makeParallelRequests} = require('./service.js');
const constants = require('./constants');


async function fetchPlayerStat(playerName) {
     const player = await fetchPlayerDetails(playerName);
     
     let requests = [];
     for(let i=constants.START_SEASON_YEAR; i<=constants.END_SEASON_YEAR;i++) {
          requests.push(fetchPlayerSeasonStat(i, player.id));
     }

     const playerStatResponses = await makeParallelRequests(requests);
     let above50 = 0;
     let below50 = 0;
     for(var playerStatResponse of playerStatResponses) {
          if(playerStatResponse.body.data.length>0 && playerStatResponse.body.data[0].games_played>50) {
               above50++;
          }
          else {
               below50++;
          }
     }    
     
     return {"Player Name": playerName, "Games Played": {"Above50": above50, "Below50": below50}};
}

async function fetchPlayerDetails(playerName) {
     const playersResponse = await request(constants.BALL_DONT_LIE_BASE_URL+'players', {'search': playerName});
     if(!playersResponse.body.data) {
          console.log("Error occured while calling players API");
          return {};
     }
     if(playersResponse.body.data.length==0) {
          console.log(`Unable to find player- ${playerName}`);
          return {}
     }
     return playersResponse.body.data[0];
}

const fetchPlayerSeasonStat = (season, playerIds) => {
     return request(constants.BALL_DONT_LIE_BASE_URL+'season_averages', {'player_ids[]': playerIds, 'season': season});
}



const playerName = "Lebron James";
fetchPlayerStat(playerName)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
