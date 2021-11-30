import * as d3 from "d3";
import * as _ from "underscore";
import * as crystvis from "crystvis-js";
import { request as requestDatasets } from "@galaxyproject/charts/lib/utilities/datasets";

_.extend(window.bundleEntries || {}, {
    load: function (options) {
        console.debug("targets are:");
        console.debug(options.target);
        var visualiser = new crystvis.CrystVis('#' + options.target, 640, 480);
        $.ajax({
            url: options.dataset.download_url,
            success: function (response) {
                var name = options.dataset.name;
                var ext = options.dataset.file_ext;
                var settings = options.chart.settings;
                var representation_parameters = {
                    atom_labels: settings.get("atom_labels"),
                };
                var loaded = visualiser.loadModels(response, ext, name);
                console.debug("loaded model:");
                console.debug(loaded);
                visualiser.displayModel(Object.keys(loaded)[0]);
                console.debug("visualiser:");
                console.debug(visualiser);
                visualiser.displayed = visualiser.model.find({
                    'all': []
                });
                setParameters(visualiser, representation_parameters);
                options.chart.state('ok', 'testing');
                options.process.resolve();
            }
        });
    }
});

function setParameters(visualiser, parameters) {
    if (parameters["atom_labels"] == "on") {
        visualiser.displayed.addLabels();
    }
    else {
        visualiser.displayed.removeLabels();
    }
};