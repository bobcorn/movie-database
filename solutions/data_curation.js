// Dataset ingestion and curation

/*
    Fix "year" (from String to Int)
*/
db.movies
  .find({
    year: {
      $exists: true,
    },
  })
  .forEach(function (doc) {
    var yearInt = new NumberInt(doc.year);
    db.movies.updateOne(
      {
        _id: doc._id,
      },
      {
        $set: {
          year: yearInt,
        },
      }
    );
  });

/*
    Fix "runtime" (from String to Int)
*/
db.movies
  .find({
    runtime: {
      $exists: true,
    },
  })
  .forEach(function (doc) {
    if (typeof doc.runtime == "string") {
      var runtimeInt = 0;
      var noComma = doc.runtime.replace(/,/g, "");
      if (noComma.match(/\d+ min/)) {
        runtimeInt += new NumberInt(noComma.split(" ").slice(-2, -1)[0]);
      }

      if (noComma.match(/\d+ h/)) {
        runtimeInt +=
          new NumberInt(noComma.split(" ").reverse().slice(-1)[0]) * 60;
      }
      db.movies.updateOne(
        {
          _id: doc._id,
        },
        {
          $set: {
            runtime: runtimeInt,
          },
        }
      );
    }
  });

/*
    Fix "lastupdated" (from String to Date)
*/
db.movies
  .find({
    lastupdated: {
      $exists: true,
    },
  })
  .forEach(function (doc) {
    var lastupdatedDate = new Date(doc.lastupdated);
    db.movies.updateOne(
      {
        _id: doc._id,
      },
      {
        $set: {
          lastupdated: lastupdatedDate,
        },
      }
    );
  });

/*
    Fix "imdb.votes" (from String to Int)
*/
db.movies
  .find({
    "imdb.votes": {
      $exists: true,
    },
  })
  .forEach(function (doc) {
    var votesInt = new NumberInt(doc.imdb.votes);
    db.movies.updateOne(
      {
        _id: doc._id,
      },
      {
        $set: {
          "imdb.votes": votesInt,
        },
      }
    );
  });

/*
    Fix "tomatoes.boxOffice" (from String to Decimal)
*/
db.movies
  .find({
    "tomatoes.boxOffice": {
      $exists: true,
    },
  })
  .forEach(function (doc) {
    if (typeof doc.tomatoes.boxOffice == "string") {
      if (doc.tomatoes.boxOffice.slice(-1).toLowerCase() === "k") {
        var magnitude = 1000;
      } else if (doc.tomatoes.boxOffice.slice(-1).toLowerCase() === "m") {
        var magnitude = 1000000;
      } else {
        return;
      }
      boxOfficeDecimal =
        new NumberDecimal(doc.tomatoes.boxOffice.slice(1, -1)) * magnitude;
      db.movies.updateOne(
        {
          _id: doc._id,
        },
        {
          $set: {
            "tomatoes.boxOffice": boxOfficeDecimal,
          },
        }
      );
    }
  });