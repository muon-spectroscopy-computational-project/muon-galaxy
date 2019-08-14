"""
Migration script to add dbkey column for visualization.
"""
from __future__ import print_function

import logging
from json import loads

from sqlalchemy import Column, Index, MetaData, Table, TEXT

from galaxy.model.migrate.versions.util import add_column, drop_column

log = logging.getLogger(__name__)
metadata = MetaData()


def upgrade(migrate_engine):
    print(__doc__)
    metadata.bind = migrate_engine
    metadata.reflect()

    Visualization_table = Table("visualization", metadata, autoload=True)
    Visualization_revision_table = Table("visualization_revision", metadata, autoload=True)

    # Create dbkey columns.
    x = Column("dbkey", TEXT)
    add_column(x, Visualization_table, metadata)
    y = Column("dbkey", TEXT)
    add_column(y, Visualization_revision_table, metadata)
    # Manually create indexes for compatability w/ mysql_length.
    xi = Index("ix_visualization_dbkey", Visualization_table.c.dbkey, mysql_length=200)
    xi.create()
    yi = Index("ix_visualization_revision_dbkey", Visualization_revision_table.c.dbkey, mysql_length=200)
    yi.create()

    all_viz = migrate_engine.execute("SELECT visualization.id as viz_id, visualization_revision.id as viz_rev_id, visualization_revision.config FROM visualization_revision \
                    LEFT JOIN visualization ON visualization.id=visualization_revision.visualization_id")
    for viz in all_viz:
        viz_id = viz['viz_id']
        viz_rev_id = viz['viz_rev_id']
        if viz[Visualization_revision_table.c.config]:
            dbkey = loads(viz[Visualization_revision_table.c.config]).get('dbkey', "").replace("'", "\\'")
            migrate_engine.execute("UPDATE visualization_revision SET dbkey='%s' WHERE id=%s" % (dbkey, viz_rev_id))
            migrate_engine.execute("UPDATE visualization SET dbkey='%s' WHERE id=%s" % (dbkey, viz_id))


def downgrade(migrate_engine):
    metadata.bind = migrate_engine
    metadata.reflect()

    drop_column('dbkey', 'visualization', metadata)
    drop_column('dbkey', 'visualization_revision', metadata)
