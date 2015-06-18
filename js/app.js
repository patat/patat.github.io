var wikiGame = angular.module( 'wikiGame', []);

wikiGame.controller( 'wikiCtrl', function($scope, $http) {
  $scope.wikiContent = [];

  var url = 'http://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json&origin=http://patat.github.io';

  // $http.get( url )
  //   .success( function( response ) {
  //     $scope.wikiContent = response;
  //     console.log($scope.wikiContent);
  //   } );

  $http.jsonp("http://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Super%20Hero")
    .success(function(data) {
      console.log(data);
    });
});
