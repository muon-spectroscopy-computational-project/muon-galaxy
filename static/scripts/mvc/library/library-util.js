"use strict";define([],function(){return{generateFolderComparator:function(e,t){return function(r,o){if(r.get("type")===o.get("type")){if("file_ext"===e){var a=r.hasOwnProperty("file_ext")&&r.get("file_ext"),n=o.hasOwnProperty("file_ext")&&o.get("file_ext");if(!a||!n)return a&&!n?-1:!a&&n?1:0}return r.get(e).toLowerCase()>o.get(e).toLowerCase()?"asc"===t?1:-1:o.get(e).toLowerCase()>r.get(e).toLowerCase()?"asc"===t?-1:1:0}return"folder"===r.get("type")?-1:1}},generateLibraryComparator:function(e,t){return function(r,o){return r.get(e).toLowerCase()>o.get(e).toLowerCase()?"asc"===t?1:-1:o.get(e).toLowerCase()>r.get(e).toLowerCase()?"asc"===t?-1:1:0}}}});
//# sourceMappingURL=../../../maps/mvc/library/library-util.js.map
