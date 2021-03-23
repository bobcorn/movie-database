// Map-reduce framework

/* 
    1.  Find the number of movies published for each year.
*/
var mapFunction = function () {
  emit(this.year, 1);
};

var reduceFunction = function (id, values) {
  return Array.sum(values);
};

db.movies.mapReduce(mapFunction, reduceFunction, {
  out: "number_of_movies_per_year",
});

db.number_of_movies_per_year.find();

/* 
    2.  Group movies according to their number of writers. For each group, find the average
        number of words in the title.
        NB: Check in the map function if the ​writers​ attribute is ​defined​ (i.e., if it exists).
*/
var mapFunction = function () {
  if (this.writers) {
    emit(this.writers.length, String(this.title).split(" ").length);
  }
};

var reduceFunction = function (id, values) {
  return Array.sum(values) / values.length;
};

db.movies.mapReduce(mapFunction, reduceFunction, {
  out: "average_title_length_per_writers",
});

db.average_title_length_per_writers.find();

/* 
    3.  Count the number of movies available for each language (attribute ​languages​).
        NB: Check in the map function if the ​languages​ attribute is ​defined​ (i.e., if it exists).
        NB​2​: It is possible to emit multiple pairs for each document using ​iterators​ over an array.
*/
var mapFunction = function () {
  if (this.languages) {
    for (var i = 0; i < this.languages.length; i++) {
      emit(this.languages[i], 1);
    }
  }
};

var reduceFunction = function (id, values) {
  return Array.sum(values);
};

db.movies.mapReduce(mapFunction, reduceFunction, {
  out: "movies_per_language",
});

db.movies_per_language.find();
