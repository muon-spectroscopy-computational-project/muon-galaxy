# SWOT Analysis of Galaxy

Internal – our own needs and capabilities

External – our user base and community we support; external dev support; existing infrastructure

## STRENGTHS - Internal and Helpful

* Galaxy UI generally aligns with our vision - lower design workload for us
* Very easy to incorporate new command-line tools, even with quite complex options
* Reproducibility – supports login and persistent, shareable history
* Workflow builder allows for easy building and sharing of workflows
* Can be run locally on Linux and MacOS
* Pre-existing scalable Ansible setup for easier deployment
* Highly extensible/customisable modular code structure
* 'Small' UX bonuses like form validation, datatype sniffing
* Potential for future integration with SCARF/IRIS IAM

## WEAKNESSES – Internal and Harmful

* Limited I/O for visualisations
* Accessibility is not good for disabled/assistive tech users
* No support for running Galaxy locally on Windows
* Scheduling overhead for very short tasks is significant – tasks appear to run slowly compared to CLI
* Galaxy collections don't support how pymuon-suite nests folders - so must zip/compress instead
* No existing support for molecule file types
* File formats don't play nicely with ASE – potentially this is also an issue with the ASE file type sniffing
* Harder to iterate Galaxy tools and pymuon-suite/crystvis-js alongside each other

## OPPORTUNITIES – External and Helpful

* Thriving development community that welcomes contributions and can offer expertise
* Potential collaborations with Galaxy dev team and other folks working on material science (e.g. Jorge)
* Long-term sustainability and maintenance likely, due to size of the project
* Lots of server admins (large and small scale) to draw experience from
* Can migrate tools to central maintenance if we wish – would reduce maintenance overhead and would not stop us continuing to develop them

## THREATS – External and Harmful

* Large infrastructure intended for HPC systems – overkill?
* Long-term support and funding for Galaxy is beyond our control
* If we diverge too much from the core Galaxy, keeping up with updates will be hard
* Ongoing UI component rewrite may interfere with our work

## Negating Weaknesses and Threats


| Weakness/Threat | Negated by |
| -------- | -------- |
| I/O viz  | We can build whatever we want into the UI - Galaxy is quite flexible on this front |
| Accessibility | Core dev team are keen to improve this; if we work on this we improve Galaxy for whole user base |
| Windows support | Possible local Windows solution using Docker - though when trying out of the box, UI loaded but uploading data didn't work |
| Scheduling overhead | People who use the CLI won't use Galaxy if it's slower, but people who don't use the CLI won't know the difference... Also, we trade speed for stability and reproducibility |
| Folder nesting | Can look into e.g. pkl for data transfer between pymuon-suite tools, or extending Galaxy collections to suit our purposes. Or zipping may just be fine if people have to take their data off to their HPC cluster anyway |
| Unsupported file types | Community support for developing new/custom datatypes |
| Iteration | More careful versioning is probably a good thing |
| Overkill? | Comes with many features that we will use that would be time-consuming to develop ourselves - e.g. history and workflow builder |
| Long-term funding | |
| Divergence | Develop modular features that can be merged back into core Galaxy where possible |
| UI rewrite | Communication with devs and careful timing of development |

## Conclusion

Galaxy offers a lot of features that suit our purposes, and writing our own UI from scratch feels
like it would be reinventing the wheel a bit. The Galaxy UI is modular and flexible enough that we
can build whatever we need into it – though we should try to build features in such a way that they
can be merged back into the core Galaxy repository, to avoid diverging so far that keeping up to
date with other Galaxy developments is a struggle.

My main concern from a user perspective is speed – Galaxy tasks have a certain amount of overhead
(a few seconds) which can be pretty significant when the tool itself only takes a couple of seconds
to run. However, what we lose in speed we gain in stability (if running multiple tasks in parallel)
and reproducibility. The asynchronous management of Galaxy jobs also offers opportunities for
integration with SCARF for longer tasks. Also, users who aren't familiar with the speed of the CLI
may not even notice the slowness as a problem.

I am happy to move forward with using Galaxy.