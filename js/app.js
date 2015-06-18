var wikiGame = angular.module( 'wikiGame', []);

wikiGame.controller( 'wikiCtrl', function($scope, $http) {
  $scope.wikiContent = [];

  var url = 'https://en.wikipedia.org/w/api.php?action=query&titles=Blue%27s_Clues&prop=revisions&rvprop=content&format=json';

  $http.jsonp( url )
    .success(function(data) {
      console.log(data);
    });
});
