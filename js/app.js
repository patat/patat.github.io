var wikiGame = angular.module( 'wikiGame', []);

wikiGame.controller( 'wikiCtrl', function($scope, $http) {
  $scope.wikiContent = [];

  var url = 'http://en.wikipedia.org/w/api.php?callback=JSON_CALLBACK&action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json&';

  // $http.get( url )
  //   .success( function( response ) {
  //     $scope.wikiContent = response;
  //     console.log($scope.wikiContent);
  //   } );

  $http.jsonp( url )
    .success(function(data) {
      console.log(data);
    });
});
