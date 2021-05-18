import * as d3 from "d3";
import * as _ from "underscore";
import * as crystvis from "crystvis-js";

var Datasets = window.bundleEntries.chartUtilities.Datasets;

_.extend(window.bundleEntries || {}, {
    load: function (options) {
        console.log("aa");
        console.log(options.targets);
        var visualiser = new crystvis.CrystVis('#' + options.targets[0], 640, 480);
        console.log("bb");
        $.ajax({
            url: options.dataset.download_url,
            success: function (response) {
                console.log(response)
                var name = options.dataset.name;
                var ext = options.dataset.file_ext;
                var loaded = visualiser.loadModels(response, ext, name);
                console.log(loaded);
                visualiser.displayModel(loaded[0]);
                console.log(visualiser);
                visualiser.displayed = visualiser.model.find({
                    'all': []
                });
                options.chart.state('ok', 'testing');
                options.process.resolve();
            }
        });
    }
});
