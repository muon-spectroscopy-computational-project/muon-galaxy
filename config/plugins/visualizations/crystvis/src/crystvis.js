import * as d3 from "d3";
import * as _ from "underscore";
import * as crystvis from "crystvis-js";
import { request as requestDatasets } from "@galaxyproject/charts/lib/utilities/datasets";

window.bundleEntries = window.bundleEntries || {};
window.bundleEntries.load = function (options) {
    console.debug("target is:", options.target);
    console.debug("settings:", options.chart.settings);
    var visualiser = new crystvis.CrystVis('#' + options.target, 640, 480);
    $.ajax({
        url: options.dataset.download_url,
        success: function (response) {
            var name = options.dataset.name;
            var ext = options.dataset.file_ext;
            var settings = options.chart.settings;
            var parameters = {
                molecularCrystal: settings.get("molecularCrystal"),
                vdwScaling: settings.get("vdwScaling"),
                supercell: settings.get("supercell|enabled") ? [
                    Number(settings.get("supercell|x")),
                    Number(settings.get("supercell|y")),
                    Number(settings.get("supercell|z")),
                ] : [1, 1, 1],
            };
            console.debug("parameters:", parameters);
            var loaded = visualiser.loadModels(response, ext, name, parameters);
            visualiser.displayModel(Object.keys(loaded)[0]);
            const query = parseQuery(settings);
            console.debug("query:", query);
            setParameters(visualiser, settings.get("atom_labels"), query);
            options.chart.state('ok', 'testing');
            options.process.resolve();
        }
    });
};

function parseQuery(settings) {
    var query;
    switch (settings.get("query|type")) {
        case "indices":
            query = { "indices": [toArray(settings.get("query|indices"), true)] };
            break;
        case "elements":
            query = { "elements": [toArray(settings.get("query|elements"), false)] };
            break;
        case "cell":
            query = { "cell": [toArray(settings.get("query|cell"), true)] };
            break;
        case "box":
            query = {
                "box": [
                    toArray(settings.get("query|box_start"), true),
                    toArray(settings.get("query|box_end"), true),
                ]
            };
            break;
        case "sphere":
            query = {
                "sphere": [
                    toArray(settings.get("query|sphere_start"), true),
                    settings.get("query|sphere_radius"),
                ]
            };
            break;
        case "bonded":
            query = {
                "bonded": [
                    toArray(settings.get("query|bonded_atoms"), true),
                    settings.get("query|bonded_distance"),
                    settings.get("query|bonded_exact"),
                ]
            };
            break;
        case "molecule":
            query = {
                "molecule": [
                    toArray(settings.get("query|molecule_atoms"), true),
                ]
            };
            break;
        case "custom":
            try {
                query = JSON.parse(settings.get("query|custom_query"));
            } catch (error) {
                console.error(error);
                query = { "all": [] };
            }
            break;
        default:
            query = { "all": [] };
            break;
    }
    return settings.get("exclude") ? { "$xor": [query, { "all": [] }] } : query;
}

function toArray(string, asNumber) {
    const array = string.split(" ");
    return asNumber ? array.map(x => Number(x)) : array;
}

function setParameters(visualiser, atomLabels, query) {
    try {
        visualiser.displayed = visualiser.model.find(query);
    } catch (error) {
        console.error(error);
    }
    if (atomLabels) {
        visualiser.displayed.addLabels();
    } else {
        visualiser.displayed.removeLabels();
    }
};