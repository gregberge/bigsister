define(["backbone"],
function(Backbone){
	var Collection = Backbone.Model.extend({
		urlRoot: "movie"
	});

	return Collection;
});