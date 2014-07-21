define(
    [
        'angular',
        'config',

        'app/Main/component/controller/AppController',
        'app/Main/component/controller/DashboardController',
        'app/Main/component/controller/SidebarController',

        'app/Main/component/service/PanelBuilder',

        'app/Main/config/routing',

        'angular-ui-router', 'famous-angular', 'restangular'
    ],
    function (
        angular,
        config,

        AppController,
        DashboardController,
        SidebarController,

        PanelBuilder,

        routing
        ) {
        "use strict";

        var MainModule = angular.module('main', ['ui.router', 'restangular']);
        MainModule.constant('config', config);

        MainModule.controller('AppController', AppController);
        MainModule.controller('DashboardController', DashboardController);
        MainModule.controller('SidebarController', SidebarController);

        MainModule.service('PanelBuilder', PanelBuilder);

        MainModule.config(routing);

        return MainModule;
    }
);