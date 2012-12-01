define(["backbone", "models/movie"],
function(Backbone, Movie){
	var Collection = Backbone.Collection.extend({
		model: Movie,
		url: "/movies"
	});

	return Collection;
});