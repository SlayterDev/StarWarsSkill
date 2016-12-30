var http 	   = require('http')
  , AlexaSkill = require('./AlexaSkill')
  , APP_ID	   = process.env.APP_ID;

var films = {
	"episode 4": 1,
	"a new hope": 1,
	"episode 2": 5,
	"attack of the clones": 5,
	"the attack of the clones": 5,
	"episode 1": 4,
	"the phantom menace": 4,
	"phantom menace": 4,
	"episode 3": 6,
	"revenge of the sith": 6,
	"the revenge of the sith": 6,
	"episode 6": 3,
	"return of the jedi": 3,
	"the return of the jedi": 3,
	"episode 5": 2,
	"empire strikes back": 2,
	"the empire strikes back": 2,
	"episode 7": 7,
	"force awakens": 7,
	"the force awakens": 7
};

var url = function(film) {
	return 'http://swapi.co/api/films/' + film + '/';
};

var toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

var getJsonFromSwapi = function(film, callback) {
	console.log("film no: " + film);
	http.get(url(film), function(res) {
		var body = '';

		res.on('data', function(data) {
			body += data;
		});

		res.on('end', function() {
			var result = JSON.parse(body);
			callback(result);
		});
	}).on('error', function(e) {
		console.log('Error: ' + e);
	});
};

var handleCrawlRequest = function(intent, session, response) {
	var filmName = intent.slots.episode.value;
	var filmId = films[filmName].toString();
	getJsonFromSwapi(filmId, function(data) {
		var cardText = data.opening_crawl;
		var text = cardText.replace(/\r?\n/g, " ");

		var heading = 'Opening Crawl for \"' + toTitleCase(filmName) + '\"';
		response.tellWithCard(text, heading, cardText);
	});
};

var StarWarsSkill = function() {
	AlexaSkill.call(this, APP_ID);
};

StarWarsSkill.prototype = Object.create(AlexaSkill.prototype);
StarWarsSkill.prototype.constructor = StarWarsSkill;

StarWarsSkill.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
	var output = "Welcome to Star Wars Facts! Ask for the opening crawl of any Star Wars Film.";

	response.ask(output);
};

StarWarsSkill.prototype.intentHandlers = {
	CrawlIntent: function(intent, session, response) {
		handleCrawlRequest(intent, session, response);
	},

	HelpIntent: function(intent, session, response) {
		var output = "I can recite for you the opening crawl for any Star Wars movie.";

		response.ask(output);
	}
};

exports.handler = function(event, context) {
	var skill = new StarWarsSkill();
	skill.execute(event, context);
};
