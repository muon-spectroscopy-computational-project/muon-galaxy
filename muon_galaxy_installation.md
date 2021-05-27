# Installing Muon Galaxy

as of 26/05/2021

## Prerequisites

Galaxy requires UNIX/Linux or Mac OSX, plus Python 3.6. More information in the [Galaxy Install Documentation](https://galaxyproject.org/admin/get-galaxy/).

If running on a fresh Cloud VM, see [my detailed Galaxy installation notes](https://github.com/muon-spectroscopy-computational-project/muon-galaxy/blob/eli/dev-documentation/muon_galaxy_dev_notes.md#installing-on-cloud-vm).

## Downloading Repositories

### Muon Galaxy

The Galaxy Git project is big. A standard `git clone https://github.com/muon-spectroscopy-computational-project/muon-galaxy/` operation will give you a 634 MB folder, mostly of Git history. Below are some options to change the size of the download:

| Command                                            | Size   |
| -------------------------------------------------- | ------ |
| `git clone`                                        | 634 MB |
| `git clone --branch eli/combine-changes --depth 1` | 134 MB |
| Download zip file and extract                      | 92 MB  |

However, most of the folder bulk comes from the Galaxy installation and build.

### Muon Galaxy Tools

Clone the repo and checkout the `eli/add-pm-muairss` branch. Keep this separate from the main Galaxy repo.
```
git clone --branch eli/add-pm-muairss https://github.com/muon-spectroscopy-computational-project/muon-galaxy-tools
```

## Configuring Galaxy

Go into the Galaxy root folder and checkout branch `eli/combine-changes`, which collates all the changes made so far for Muon Galaxy.

Set up the config files:
```bash
cp config/galaxy.yml.sample config/galaxy.yml
cp config/tool_conf.xml.sample config/tool_conf.xml
touch config/muon_tool_conf.xml
cp config/datatypes_conf.xml.sample config/datatypes_conf.xml
```
Edit `config/galaxy.yml` and edit the `tool_config_file` line. It should read:
```yaml
tool_config_file: tool_conf.xml, muon_tool_conf.xml
```
Also uncomment the `datatypes_config_file` line. It should read:
```yaml
datatypes_config_file: datatypes_conf.xml
```

Edit `config/tool_conf.xml`. Remove all its existing content, and replace it with the following to display only the upload tool:
```xml=1.0
<?xml version="1.0"?>
<toolbox monitor="true">
  <section id="getext" name="Get Data">
    <tool file="data_source/upload.xml" />
  </section>
</toolbox>
```
Edit `config/muon_tool_conf.xml`. Add the following content to display the muon tools:
```xml=1.0
<?xml version="1.0"?>
<toolbox tool_path="../muon-galaxy-tools">
    <section name="Muon Tools" id="muon">
        <tool file="pm_muairss_write/pm_muairss_write.xml" />
    </section>
</toolbox>
```
Replace the `tool_path` value with the path to where you cloned the muon-galaxy-tools repo.

Edit `config/datatypes_conf.xml` and add the following lines at line 718 (after "pqr" and before "trr"):
```xml=1.0
<datatype extension="cif" type="galaxy.datatypes.molecules:CIF" display_in_upload="true"/>
<datatype extension="cell" type="galaxy.datatypes.molecules:Cell" display_in_upload="true"/>
```
Add the following at line 1009 (after "PDB" and before "MOL2"):
```xml=1.0
<sniffer type="galaxy.datatypes.molecules:Cell"/>
```
This enables the datatypes and sniffers for `.cif` and `.cell` files (no sniffer for CIF written yet). There is no datatype built for YAML yet so YAML files are treated as text files.

To save 1.3 GB and a bit of time during installation, find and delete everything in the `config/plugins/visualizations` directory except the `crystvis` and `common` subdirectories:
```shell
find ./config/plugins/visualizations -mindepth 1 -maxdepth 1 -type d -not \( -name crystvis -o -name common \) -exec echo rm -rf '{}' \;
```
(remove the `echo` to actually delete the folders)

## Building Galaxy

In the Galaxy root folder, run `./run.sh`. This will install Python and NPM dependencies and launch the Galaxy instance, which will be available on `localhost:8080`. The initial build takes about 10 minutes, subsequent ones are faster.

This expands the folder to a size of 4 GB, starting from the 134 MB option above (2.7 GB if you deleted the visualisers).

I tried to investigate reducing the number of dependencies, but didn't get anywhere. I expect you could strip out lots of datatypes and example files and get rid of some dependencies that way, but that's not trivial to do (though also not particularly difficult). Even then, most of the bulk is just the built web client.

## Uploading Data

Add data to Galaxy using the "Upload Data" button. Once loaded, select the correct file type for each datatype ("cif" for `cif`, "cell" for `.cell`, "txt" for `.yaml`). This can be done in the upload dialog or later.

## Using the Tools

The "Generate muon structures (pm-muairss)" tool requires a `.cell` file and a `.yaml` file as input, with the `.yaml` file following the format required for pymuon-suite. The third tool parameter, "out_folder," must have a value that matches the `out_folder` parameter in the `.yaml` file (a quirk of incomplete tool development). Example files can be found in the muon-galaxy-tools repo: [Si.cell](https://github.com/muon-spectroscopy-computational-project/muon-galaxy-tools/blob/eli/add-pm-muairss-write/pm_muairss_write/test-data/Si.cell) and [Si-muairss-castep.yaml](https://github.com/muon-spectroscopy-computational-project/muon-galaxy-tools/blob/eli/add-pm-muairss-write/pm_muairss_write/test-data/Si-muairss-castep.yaml) (if using these, the out_folder parameter value should be "si-muon-airss-out").

To use the visualisation tool, you have to create a login - this is stored locally and will also preserve your Galaxy history when you shut down the server. Once logged in, click "Create Visualization." The [crystvis-js](https://github.com/stur86/crystvis-js) visualiser should be in the list and searchable (it'll be the only option in the list if you deleted everything else earlier). This visualiser requires a `.cif` file as input - an example can be found here: [CHA.cif](https://github.com/stur86/crystvis-js/blob/master/test/data/CHA.cif).

The crystvis-js visualizer currently uses [Eli's fork](https://github.com/elichad/crystvis-js/tree/eli/change-three-dependency) due to a dependency issue.
