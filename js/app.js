var wikiGame = angular.module( 'wikiGame', []);

wikiGame.controller( 'wikiCtrl', function($scope, $http) {
  $scope.wikiContent = [];

  var url = 'https://ru.wikipedia.org/wiki/%D0%A4%D0%B8%D0%BD%D0%B0%D0%BB_%D0%9A%D1%83%D0%B1%D0%BA%D0%B0_%D0%A1%D1%82%D1%8D%D0%BD%D0%BB%D0%B8_2015';

  $http.get( url )
    .success( function( response ) {
      
      console.log( response );
    } );

  // $http.jsonp( url )
  //   .success(function(data) {
  //     console.log(data);
  //   });
});
