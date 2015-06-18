var wikiGame = angular.module( 'wikiGame', []);

wikiGame.controller( 'wikiCtrl', function($scope, $http) {
  $scope.wikiContent = [];

  var url = 'https://ru.wikipedia.org/w/api.php?callback=JSON_CALLBACK&action=query&titles=Сковородка_(гитара)&prop=revisions&rvprop=content&format=json';

  $http.jsonp( url )
    .success(function(data) {
      console.log(data);
    });
});
