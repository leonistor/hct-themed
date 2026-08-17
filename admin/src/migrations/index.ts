import * as migration_20260817_103208_remove_obsolete_collections from './20260817_103208_remove_obsolete_collections';

export const migrations = [
  {
    up: migration_20260817_103208_remove_obsolete_collections.up,
    down: migration_20260817_103208_remove_obsolete_collections.down,
    name: '20260817_103208_remove_obsolete_collections'
  },
];
