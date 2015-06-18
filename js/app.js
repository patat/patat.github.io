var wikiGame = angular.module( 'wikiGame', []);

wikiGame.controller( 'wikiCtrl', function($scope, $http) {
  $scope.wikiContent = [];

  var url = 'https://ru.wikipedia.org/w/api.php?action=query&titles=Финал_Кубка_Стэнли_2015&prop=revisions&rvprop=content&format=json';

  $http.jsonp( url )
    .success(function(data) {
      console.log(data);
    });
});
