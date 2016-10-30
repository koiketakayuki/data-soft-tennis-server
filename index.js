var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var service = require('./soft-tennis-data-service');
var connection = require('./sql-connection-provider').provideConnection();

app.use(bodyParser.urlencoded({extended: true}));

var withHeader = function (cont) {
  return function (req, res) {
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.setHeader('Content-Type', 'application/json');
     cont(req, res);
  };
};

var simpleQuery = function(methodName) {
  return withHeader(function(req, res){
    var proc = service[methodName];

    proc(connection).then(function (results) {
      res.send(JSON.stringify(results));
    });
  });
};


app.get('/player', simpleQuery('getPlayers'));

app.get('/team', simpleQuery('getTeams'));
app.get('/team/works-team', simpleQuery('getWorksTeams'));
app.get('/team/university', simpleQuery('getUniversityTeams'));
app.get('/team/high-school', simpleQuery('getHighSchoolTeams'));
app.get('/team/junior-high', simpleQuery('getJuniorHighTeams'));

app.get('/competition', simpleQuery('getCompetitions'));

app.get('/match', simpleQuery('getMatches'));


app.get('/competition/:competitionId', withHeader(function (req, res) {
  service
    .getCompetitionById(connection, req.params.competitionId)
    .then(function (competition) { 
      res.send(JSON.stringify(competition));
     });
  })
);

app.get('/competition/:competitionId/match', withHeader(function (req, res) {
  service
    .getMatchesByCompetitionId(connection, req.params.competitionId)
    .then(function (competition) { 
      res.send(JSON.stringify(competition));
    });
  })
);

app.get('/team/:teamId', withHeader(function (req, res) {
  service
    .getTeamById(connection, req.params.teamId)
    .then(function (team) { 
      res.send(JSON.stringify(team));
    });
  })
);

app.get('/team/:teamId/player', withHeader(function (req, res) {
  service
    .getPlayersByTeamId(connection, req.params.teamId)
    .then(function (players) { 
      res.send(JSON.stringify(players));
    });
  })
);

app.get('/team/:teamId/former-player', withHeader(function (req, res) {
  service
    .getFormerPlayersByTeamId(connection, req.params.teamId)
    .then(function (players) { 
      res.send(JSON.stringify(players));
    });
  })
);

app.get('/player/:playerId', withHeader(function (req, res) {
  service
    .getPlayerById(connection, req.params.playerId)
    .then(function (playerAndTeamData) { 
      res.send(JSON.stringify(playerAndTeamData));
    });
  })
);

app.listen(80);
