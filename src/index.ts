import { request, makeParallelRequests } from './service';
import * as constants from './constants';

interface Player {
  id: number;
}

interface PlayerStatResponse {
  body: {
    data: {
      games_played: number;
    }[];
  };
}

interface PlayerDetailsResponse {
  body: {
    data: Player[];
  };
}

async function fetchPlayerStat(playerName: string) {
  const player = await fetchPlayerDetails(playerName);

  let requests: Promise<PlayerStatResponse>[] = [];
  for (let i = constants.START_SEASON_YEAR; i <= constants.END_SEASON_YEAR; i++) {
    requests.push(fetchPlayerSeasonStat(i, player.id));
  }

  const playerStatResponses = await makeParallelRequests(requests);
  let above50 = 0;
  let below50 = 0;
  for (const playerStatResponse of playerStatResponses) {
    if (playerStatResponse.body.data.length > 0 && playerStatResponse.body.data[0].games_played > 50) {
      above50++;
    } else {
      below50++;
    }
  }

  return { "Player Name": playerName, "Games Played": { "Above50": above50, "Below50": below50 } };
}

async function fetchPlayerDetails(playerName: string) {
  const playersResponse: PlayerDetailsResponse = await request(constants.BALL_DONT_LIE_BASE_URL + 'players', { 'search': playerName });
  if (!playersResponse.body.data) {
    console.log("Error occurred while calling players API");
    return {} as Player;
  }
  if (playersResponse.body.data.length === 0) {
    console.log(`Unable to find player - ${playerName}`);
    return {} as Player;
  }
  return playersResponse.body.data[0];
}

const fetchPlayerSeasonStat = (season: number, playerIds: number) => {
  return request(constants.BALL_DONT_LIE_BASE_URL + 'season_averages', { 'player_ids[]': playerIds, 'season': season });
}

const playerName = "LeBron James";
fetchPlayerStat(playerName)
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
