define(['lib/config/Configurable'], function (Configurable) {
    'use strict';

    /**
     * Return the title depending if the config is a string or a function
     * @param {Function} config
     * @param {Entity} entity
     * @returns {String}
     */
    function getTitle(config, entity) {
        var title = config;
        if (typeof (title) === 'function') {
            title = title(entity);
        }

        return title;
    }

    var defaultPaginationLink = function(page, maxPerPage) {
        return {
            page: page,
            per_page: maxPerPage
        };
    };

    var defaultFilterQuery = function(query) {
        return {
            q: query
        };
    };

    var defaultTotalItems = function(response) {
        return response.headers('X-Count') || 0;
    };

    var defaultListingTitle = function(entity) {
        return 'List of ' + entity.label();
    };

    var defaultEditionTitle = function(entity) {
        return 'Edit ' + entity.label();
    };

    var defaultCreationTitle = function(entity) {
        return 'Create ' + entity.label();
    };

    var defaultDescription = function (entity) {
        return null;
    };

    var defaultSortParams = function (field, dir) {
        return {
            _sort: field,
            _sortDir: dir
        };
    };

    return function(entityName) {
        var name = entityName || 'entity';
        var fields = {};

        var config = {
            label: 'My entity',
            order: null,
            titleList: defaultListingTitle,
            titleCreate: defaultCreationTitle,
            titleEdit: defaultEditionTitle,
            description: defaultDescription,
            dashboard: 5,
            perPage: 30,
            pagination: defaultPaginationLink,
            filterQuery: defaultFilterQuery,
            infinitePagination: false,
            totalItems: defaultTotalItems,
            extraParams: null,
            sortParams: defaultSortParams,
            interceptor: null
        };

        /**
         * @constructor
         */
        function Entity() {
        }

        /**
         * Object.name is protected, use a getter for it
         *
         * @returns {string}
         */
        Entity.getName = function() {
            return name;
        };

        /**
         * Add an field to the entity
         * @param {Field} field
         */
        Entity.addField = function(field) {
            if (field.order() === null) {
                field.order(Object.keys(fields).length);
            }

            fields[field.getName()] = field;

            return this;
        };

        /**
         * Returns all fields
         *
         * @returns {Object}
         */
        Entity.getFields = function() {
            return fields;
        };


        /**
         * Returns a field
         *
         * @returns {Field}
         */
        Entity.getField = function(name) {
            return fields[name];
        };

        /**
         * Return the identifier field
         *
         * @returns {Field}
         */
        Entity.getIdentifier = function() {
            for(var i in fields) {
                if (!fields.hasOwnProperty(i)){
                    continue;
                }

                var field = fields[i];
                if (field.identifier()) {
                    return field;
                }
            }
        };

        /**
         * Returns all references
         *
         * @returns {Object}
         */
        Entity.getReferences = function() {
            var references = this.getFieldsOfType('Reference');
            var referencesMany = this.getFieldsOfType('ReferenceMany');

            angular.forEach(referencesMany, function(ref, key) {
                references[key] = ref;
            });

            return references;
        };

        /**
         * Returns all referenced lists
         *
         * @returns {Object}
         */
        Entity.getReferencedLists = function() {
            return this.getFieldsOfType('ReferencedList')
        };

        /**
         * Returns fields by type
         *
         * @param {String }type
         * @returns {Array}
         */
        Entity.getFieldsOfType = function(type) {
            var results = {};

            for(var i in fields) {
                if (!fields.hasOwnProperty(i)) {
                    continue;
                }

                var field = fields[i];
                if (field.name === type) {
                    results[i] = field;
                }
            }

            return results;
        };

        /**
         * Return configurables extra params
         *
         * @returns {Object}
         */
        Entity.getExtraParams = function() {
            var params = {};
            if (config.extraParams) {
                params = typeof (config.extraParams) === 'function' ? config.extraParams() : config.extraParams;
            }

            return params;
        };

        /**
         * Return configurables sorting params
         *
         * @returns {Object}
         */
        Entity.getSortParams = function(sortField, sortDir) {
            var params = null;
            if (sortField) {
                params = typeof (config.sortParams) === 'function' ? config.sortParams(sortField, sortDir) : config.sortParams;
            }

            return params;
        };

        Entity.getListTitle = function() {
            return getTitle(config.titleList, this);
        };

        Entity.getCreateTitle = function() {
            return getTitle(config.titleCreate, this);
        };

        Entity.getEditTitle = function() {
            return getTitle(config.titleEdit, this);
        };

        Entity.getDescription = function() {
            return getTitle(config.description, this);
        };

        Configurable(Entity, config);

        return Entity;
    }
});
