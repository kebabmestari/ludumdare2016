/// this file has all the maps in JSON
/// plaintext files are in maps folder

var _maps = [];

// test map
_maps.push({
    name: 'test',
    tiles: [
        [1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1],
        [1,0,0,0,1,0,1],
        [1,0,0,0,0,0,1],
        [1,0,0,0,0,0,1],
        [1,0,0,1,0,0,1],
        [1,1,1,1,1,1,1],
          ],
    objects: [
        ['flint', {x: 5, y: 1}],
        ['stick', {x: 1, y: 1}],
        ['stick', {x: 1, y: 4}],
    ],
    shape: 'spear'
});

// namespace for possible shapes
_shapes = {
    'spear':
    [
        ['flint'],
        ['stick'],
        ['stick'],
    ]
};