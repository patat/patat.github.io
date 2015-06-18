var wikiGame = angular.module( 'wikiGame', []);

wikiGame.controller( 'wikiCtrl', function($scope, $http) {
  $scope.wikiContent = [];

  var url = 'http://en.wikipedia.org/w/api.php?action=query&titles=Main%20Page&prop=revisions&rvprop=content&format=json&origin=localhost/wiki';

  $http.get( url )
    .success( function( response ) {
      $scope.wikiContent = response;
      console.log($scope.wikiContent);
    } );
});